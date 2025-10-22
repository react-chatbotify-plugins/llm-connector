import { Message } from 'react-chatbotify';
import { WebLlmProviderMessage } from '../provider-message/WebLlmProviderMessage';
import { MLCEngineConfig } from '@mlc-ai/web-llm';
/**
 * Configurations for WebLlmProvider.
 */
type WebLlmProviderConfig = {
    model: string;
    systemMessage?: string;
    responseFormat?: 'stream' | 'json';
    engineConfig?: MLCEngineConfig;
    chatCompletionOptions?: Record<string, unknown>;
    messageParser?: (messages: Message[]) => WebLlmProviderMessage[];
    debug?: boolean;
};
export type { WebLlmProviderConfig };
//# sourceMappingURL=WebLlmProviderConfig.d.ts.map