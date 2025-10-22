import { Message } from 'react-chatbotify';
import { OpenaiProviderMessage } from '../provider-message/OpenaiProviderMessage';
/**
 * Configurations for OpenaiProvider in direct mode.
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
    messageParser?: (messages: Message[]) => OpenaiProviderMessage[];
    debug?: boolean;
};
/**
 * Configurations for OpenaiProvider in proxy mode.
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
    messageParser?: (messages: Message[]) => OpenaiProviderMessage[];
    debug?: boolean;
};
/**
 * Combined openai provider configurations.
 */
type OpenaiProviderConfig = DirectConfig | ProxyConfig;
export type { OpenaiProviderConfig };
//# sourceMappingURL=OpenaiProviderConfig.d.ts.map