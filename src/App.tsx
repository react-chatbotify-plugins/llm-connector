import ChatBot, { Flow, Message, Params } from 'react-chatbotify';

import RcbPlugin from './factory/RcbPluginFactory';
import { LlmConnectorBlock } from './types/LlmConnectorBlock';
import GeminiProvider from './providers/GeminiProvider';
import OpenaiProvider from './providers/OpenaiProvider';
import WebLlmProvider from './providers/WebLlmProvider';
import OllamaProvider from './providers/OllamaProvider';

// fill in your api keys below if you wish to explore/develop
const geminiApiKey = '';
const openaiApiKey = '';

const App = () => {
	// initialize the plugin
	const plugins = [
		RcbPlugin({
			autoConfig: true,
		}),
	];

	const onUserMessageCheck = async (message: Message) => {
		if (typeof message.content === 'string' && message.content.toUpperCase() === 'RESTART') {
			return 'start';
		}
	};

	const onKeyDownCheck = async (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			return 'start';
		}
		return null;
	};

	// example flow for testing
	const flow: Flow = {
		start: {
			message: async (params: Params) => {
				if (params.prevPath == null) {
					return 'Hello there, pick an LLM provider you would like to try today!';
				}
				return 'Pick another model to try!';
			},
			options: ['WebLlm', 'Gemini', 'OpenAI', 'Ollama'],
			chatDisabled: true,
			path: async (params: Params) => {
				// if browser model chosen, give a gentle warning about performance
				if (params.userInput === 'WebLlm') {
					await params.simulateStreamMessage(
						`You selected ${params.userInput}. This model runs in your browser, so responses may be slower and less accurate.`
					);
					// if gemini/openai chosen, check for presence of api keys since examples are running in 'direct' mode
				} else {
					if (
						(params.userInput === 'Gemini' && !geminiApiKey) ||
						(params.userInput === 'OpenAI' && !openaiApiKey)
					) {
						await params.simulateStreamMessage(
							`You selected ${params.userInput} in 'direct' mode but no API key was set!`
						);
						return 'start';
					} else {
						await params.simulateStreamMessage(`You selected ${params.userInput}, ask away!`);
					}
				}
				await params.simulateStreamMessage(
					"You may type 'RESTART' or hit the 'ESC' key to select another model."
				);
				return params.userInput.toLowerCase();
			},
		} as LlmConnectorBlock,
		webllm: {
			llmConnector: {
				provider: new WebLlmProvider({
					model: 'Qwen2-0.5B-Instruct-q4f16_1-MLC',
				}),
				outputType: 'character',
				stopConditions: {
					onUserMessage: onUserMessageCheck,
					onKeyDown: onKeyDownCheck,
				},
			},
		} as LlmConnectorBlock,
		gemini: {
			llmConnector: {
				provider: new GeminiProvider({
					mode: 'direct',
					model: 'gemini-1.5-flash',
					responseFormat: 'stream',
					apiKey: geminiApiKey,
				}),
				outputType: 'character',
				stopConditions: {
					onUserMessage: onUserMessageCheck,
					onKeyDown: onKeyDownCheck,
				},
			},
		} as LlmConnectorBlock,
		openai: {
			llmConnector: {
				provider: new OpenaiProvider({
					mode: 'direct',
					model: 'gpt-4.1-nano',
					responseFormat: 'stream',
					apiKey: openaiApiKey,
				}),
				outputType: 'character',
				stopConditions: {
					onUserMessage: onUserMessageCheck,
					onKeyDown: onKeyDownCheck,
				},
			},
		} as LlmConnectorBlock,
		ollama: {
			llmConnector: {
				provider: new OllamaProvider({
					baseUrl: 'http://localhost:11434/api/chat',
					mode: 'direct',
					model: 'robot',
					apiKey: '',
					debug: true,
				}),
				outputType: 'character',
				stopConditions: {
					onUserMessage: onUserMessageCheck,
					onKeyDown: onKeyDownCheck,
				},
			},
		} as LlmConnectorBlock,
	};

	return <ChatBot id="chatbot-id" plugins={plugins} flow={flow}></ChatBot>;
};

export default App;
