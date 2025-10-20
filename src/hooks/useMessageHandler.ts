import { useEffect, useCallback, useRef } from 'react';
import {
	RcbPostInjectMessageEvent,
	RcbStopStreamMessageEvent,
	RcbStopSimulateStreamMessageEvent,
	Message,
	useOnRcbEvent,
	RcbEvent,
} from 'react-chatbotify';
import { handlePrompt } from '../utils/promptHandler';
import { Provider } from '../types/Provider';

// the core library enforces a 400ms delay before typing indicator is shown
// this ensures responses do not appear even before the typing indicator
const STREAM_DEBOUNCE_MS = 500;

/**
 * Handles message events.
 *
 * @param refs object containing relevant refs
 * @param actions object containing relevant actions
 */
const useMessageHandler = (
	refs: {
		blockLoadedRef: React.MutableRefObject<boolean>;
		providerRef: React.MutableRefObject<Provider | null>;
		messagesRef: React.MutableRefObject<Message[]>;
		outputTypeRef: React.MutableRefObject<'character' | 'chunk' | 'full'>;
		outputSpeedRef: React.MutableRefObject<number>;
		historySizeRef: React.MutableRefObject<number>;
		initialMessageRef: React.MutableRefObject<string>;
		waitForUserInputRef: React.MutableRefObject<boolean>;
		errorMessageRef: React.MutableRefObject<string>;
		onUserMessageRef: React.MutableRefObject<((msg: Message) => Promise<string | null>) | null>;
		onKeyDownRef: React.MutableRefObject<((e: KeyboardEvent) => Promise<string | null>) | null>;
	},
	actions: {
		speakAudio: (text: string) => void;
		getMessages: (sender?: string, numMessages?: number, offset?: number) => Message[] | null;
		injectMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
		simulateStreamMessage: (content: string, sender?: string) => Promise<Message | null>;
		streamMessage: (msg: string) => void;
		endStreamMessage: () => void;
		toggleTextAreaDisabled: (active?: boolean) => void;
		toggleIsBotTyping: (active?: boolean) => void;
		focusTextArea: () => void;
		goToPath: (path: string) => void;
		getIsChatBotVisible: () => boolean;
	}
) => {
	const { messagesRef, outputTypeRef, onUserMessageRef, onKeyDownRef, errorMessageRef } = refs;
	const {
		getMessages,
		injectMessage,
		simulateStreamMessage,
		toggleTextAreaDisabled,
		toggleIsBotTyping,
		goToPath,
		focusTextArea,
		getIsChatBotVisible,
	} = actions;

	// controller to abort streaming responses if required
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * Handles message events to determine whether to prompt LLM.
	 *
	 * @param event message event received
	 */
	const handler = useCallback(
		(event: RcbPostInjectMessageEvent | RcbStopStreamMessageEvent | RcbStopSimulateStreamMessageEvent) => {
			if (!refs.providerRef.current) {
				return;
			}
			const msg = event.data.message!;
			const sender = msg.sender.toUpperCase();
			msg.tags = msg.tags ?? [];
			msg.tags.push(`rcb-llm-connector-plugin:${sender}`);
			if (sender !== 'USER') {
				return;
			}
			toggleIsBotTyping(true);
			toggleTextAreaDisabled(true);
			setTimeout(async () => {
				// user-defined intercept
				if (onUserMessageRef.current) {
					const path = await onUserMessageRef.current(msg);
					if (path) {
						abortControllerRef.current?.abort();
						abortControllerRef.current = null;
						return goToPath(path);
					}
				}
				// default LLM flow
				const historySize = refs.historySizeRef.current;
				const past = messagesRef.current;
				const messagesToSend = historySize ? [...past.slice(-(historySize - 1)), msg] : [msg];

				// create & stash a new controller
				const ctrl = new AbortController();
				abortControllerRef.current = ctrl;

				handlePrompt(messagesToSend, refs, actions, { signal: ctrl.signal }).catch((err) => {
					toggleIsBotTyping(false);
					toggleTextAreaDisabled(false);
					setTimeout(() => {
						if (getIsChatBotVisible()) {
							focusTextArea();
						}
					});
					console.error('LLM prompt failed', err);
					if (outputTypeRef.current === 'full') {
						injectMessage(errorMessageRef.current);
					} else {
						simulateStreamMessage(errorMessageRef.current);
					}
				});
			}, STREAM_DEBOUNCE_MS);
		},
		[refs, actions]
	);

	// adds required events for message streaming
	useOnRcbEvent(RcbEvent.POST_INJECT_MESSAGE, handler);
	useOnRcbEvent(RcbEvent.STOP_SIMULATE_STREAM_MESSAGE, handler);
	useOnRcbEvent(RcbEvent.STOP_STREAM_MESSAGE, handler);

	// handles keydown event for stop condition
	useEffect(() => {
		const onKey = async (e: KeyboardEvent) => {
			if (onKeyDownRef.current) {
				const path = await onKeyDownRef.current(e);
				if (path) {
					abortControllerRef.current?.abort();
					abortControllerRef.current = null;
					goToPath(path);
				}
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	// calls handler once if block isn't loaded yet; then set it to true
	useEffect(() => {
		if (!refs.blockLoadedRef.current && refs.providerRef.current && !refs.waitForUserInputRef.current) {
			const lastUserMessage = getMessages('user', 1)?.pop();
			// create a mock event to trigger the handler
			// todo: this approach is a little hacky, consider refactoring later
			const fakeEvt = { data: { message: lastUserMessage } } as unknown as RcbPostInjectMessageEvent;
			handler(fakeEvt);
			refs.blockLoadedRef.current = true;
		}
	}, [handler]);
};

export { useMessageHandler };
