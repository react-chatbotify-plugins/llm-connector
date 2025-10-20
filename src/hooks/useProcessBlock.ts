import { useCallback } from 'react';
import { RcbPreProcessBlockEvent, RcbPostProcessBlockEvent, Message, RcbEvent, useOnRcbEvent } from 'react-chatbotify';
import { LlmConnectorBlock } from '../types/LlmConnectorBlock';
import { Provider } from '../types/Provider';

/**
 * Handles pre-processing and post-processing of blocks.
 *
 * @param refs object containing relevant refs
 * @param actions object containing relevant actions
 */
const useProcessBlock = (
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
	const { outputTypeRef } = refs;
	const {
		toggleTextAreaDisabled,
		toggleIsBotTyping,
		focusTextArea,
		injectMessage,
		simulateStreamMessage,
		getIsChatBotVisible,
	} = actions;

	/**
	 * Handles blocking of pre-processing and post-processing of block for full custom control.
	 *
	 * @param event block processing event received
	 */
	const handler = useCallback(
		(event: RcbPreProcessBlockEvent | RcbPostProcessBlockEvent) => {
			// if not an llm connector block, return
			const block = event.data.block as LlmConnectorBlock;
			if (!block.llmConnector) {
				return;
			}

			// prevent all block processing
			event.preventDefault();

			// pre-processing event is triggered when post-processing
			// is complete (i.e. llm generation done)
			// since pre-processing event is disabled, we simulate
			// disabling typing indicator, enabling text area and focusing on it again
			if (event.type === 'rcb-pre-process-block') {
				if (block.llmConnector?.initialMessage) {
					if (outputTypeRef.current === 'full') {
						injectMessage(refs.initialMessageRef.current);
					} else {
						simulateStreamMessage(refs.initialMessageRef.current);
					}
				}
				toggleIsBotTyping(false);
				toggleTextAreaDisabled(false);
				setTimeout(() => {
					if (getIsChatBotVisible()) {
						focusTextArea();
					}
				});
			}
		},
		[toggleIsBotTyping, toggleTextAreaDisabled, focusTextArea, getIsChatBotVisible]
	);

	// adds required events for block processing
	useOnRcbEvent(RcbEvent.PRE_PROCESS_BLOCK, handler);
	useOnRcbEvent(RcbEvent.POST_PROCESS_BLOCK, handler);
};
export { useProcessBlock };
