import { Message } from 'react-chatbotify';
import { OpenaiProviderMessage } from '../provider-message/OpenaiProviderMessage';
import { OllamaProviderMessage } from '../provider-message/OllamaProviderMessage';

/**
 * Configurations for OllamaProvider in direct mode.
 */
type DirectConfig = {
	mode: 'direct';
	model: string;
	apiKey: string;
	systemMessage?: string;
	responseFormat?: 'stream' | 'json';
	baseUrl?: string;
	method?: string;
	headers?: Record<string, string>;
	body?: Record<string, string>;
	messageParser?: (messages: Message[]) => OllamaProviderMessage[];
	debug?: boolean;
};

/**
 * Configurations for OllamaProvider in proxy mode.
 */
type ProxyConfig = {
	mode: 'proxy';
	model: string;
	baseUrl: string;
	systemMessage?: string;
	responseFormat?: 'stream' | 'json';
	method?: string;
	headers?: Record<string, string>;
	body?: Record<string, string>;
	messageParser?: (messages: Message[]) => OllamaProviderMessage[];
	debug?: boolean;
};

/**
 * Combined openai provider configurations.
 */
type OllamaProviderConfig = DirectConfig | ProxyConfig;

export type { OllamaProviderConfig };
