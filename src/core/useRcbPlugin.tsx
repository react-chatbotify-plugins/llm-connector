import { useEffect, useRef } from 'react';
import {
	useFlow,
	Plugin,
	useAudio,
	useMessages,
	usePaths,
	Message,
	useTextArea,
	useChatWindow,
} from 'react-chatbotify';

import { PluginConfig } from '../types/PluginConfig';
import { DefaultPluginConfig } from '../constants/DefaultPluginConfig';
import { Provider } from '../types/Provider';
import { useChangePath } from '../hooks/useChangePath';
import { useProcessBlock } from '../hooks/useProcessBlock';
import { useMessageHandler } from '../hooks/useMessageHandler';

/**
 * Plugin hook that handles all the core logic.
 *
 * @param pluginConfig configurations for the plugin
 */
const useRcbPlugin = (pluginConfig?: PluginConfig): ReturnType<Plugin> => {
	const blockLoadedRef = useRef<boolean>(false);
	const messagesRef = useRef<Message[]>([]);
	const providerRef = useRef<Provider | null>(null);
	const outputTypeRef = useRef<'character' | 'chunk' | 'full'>('chunk');
	const outputSpeedRef = useRef<number>(30);
	const historySizeRef = useRef<number>(0);
	const initialMessageRef = useRef<string>('');
	const waitForUserInputRef = useRef<boolean>(true);
	const errorMessageRef = useRef<string>('Unable to get response, please try again.');
	const onUserMessageRef = useRef<((msg: Message) => Promise<string | null>) | null>(null);
	const onKeyDownRef = useRef<((e: KeyboardEvent) => Promise<string | null>) | null>(null);

	const { getFlow } = useFlow();
	const { speakAudio } = useAudio();
	const { 
		messages,
		injectMessage,
		simulateStreamMessage,
		streamMessage,
		endStreamMessage,
		getMessages
	} = useMessages();
	const { goToPath } = usePaths();
	const { toggleTextAreaDisabled, focusTextArea } = useTextArea();
	const { toggleIsBotTyping, getIsChatBotVisible } = useChatWindow();

	const mergedPluginConfig = { ...DefaultPluginConfig, ...(pluginConfig ?? {}) };

	// sync messages ref
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	// handles changing of conversation path (block)
	useChangePath(getFlow, (block) => {
		providerRef.current = block.llmConnector?.provider ?? null;
		outputTypeRef.current = block.llmConnector?.outputType ?? 'chunk';
		outputSpeedRef.current = block.llmConnector?.outputSpeed ?? 30;
		historySizeRef.current = block.llmConnector?.historySize ?? 0;
		initialMessageRef.current = block.llmConnector?.initialMessage ?? '';
		waitForUserInputRef.current = block.llmConnector?.waitForUserInput ?? true;
		errorMessageRef.current = block.llmConnector?.errorMessage ?? 'Unable to get response, please try again.';
		onUserMessageRef.current = block.llmConnector?.stopConditions?.onUserMessage ?? null;
		onKeyDownRef.current = block.llmConnector?.stopConditions?.onKeyDown ?? null;
	});

	const refs = {
		blockLoadedRef,
		providerRef,
		messagesRef,
		outputTypeRef,
		outputSpeedRef,
		historySizeRef,
		initialMessageRef,
		waitForUserInputRef,
		errorMessageRef,
		onUserMessageRef,
		onKeyDownRef,
	};

	const actions = {
		speakAudio,
		getMessages,
		injectMessage,
		simulateStreamMessage,
		streamMessage,
		endStreamMessage,
		toggleTextAreaDisabled,
		toggleIsBotTyping,
		focusTextArea,
		goToPath,
		getIsChatBotVisible,
	};

	// handles pre-processing and post-processing of blocks.
	useProcessBlock(refs, actions);

	// handles message events
	useMessageHandler(refs, actions);

	// initializes plugin metadata with plugin name
	const pluginMetaData: ReturnType<Plugin> = { name: '@rcb-plugins/llm-connector' };

	// adds required events in settings if auto config is true
	if (mergedPluginConfig?.autoConfig) {
		pluginMetaData.settings = {
			event: {
				rcbChangePath: true,
				rcbPostInjectMessage: true,
				rcbStopSimulateStreamMessage: true,
				rcbStopStreamMessage: true,
				rcbPreProcessBlock: true,
				rcbPostProcessBlock: true,
			},
		};
	}

	return pluginMetaData;
};

export default useRcbPlugin;
