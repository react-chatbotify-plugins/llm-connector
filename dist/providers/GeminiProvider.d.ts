import { GeminiProviderConfig } from '../types/provider-config/GeminiProviderConfig';
import { Provider } from '../types/Provider';
import { Message } from 'react-chatbotify';
/**
 * Provider for Gemini’s API, supports both direct and proxy modes.
 */
declare class GeminiProvider implements Provider {
    private method;
    private endpoint;
    private headers;
    private body;
    private systemMessage?;
    private responseFormat;
    private messageParser?;
    private debug;
    /**
     * Sets default values for the provider based on given configuration. Configuration guide here:
     * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/Gemini.md
     *
     * @param config configuration for setup
     */
    constructor(config: GeminiProviderConfig);
    /**
     * Calls Gemini and yields each chunk (or the full text).
     *
     * @param messages messages to include in the request
     */
    sendMessages(messages: Message[]): AsyncGenerator<string>;
    /**
     * Maps the chatbot message sender to the provider message sender.
     *
     * @param sender sender from the chatbot
     */
    private roleMap;
    /**
     * Builds the full request body.
     *
     * @param messages messages to parse
     */
    private constructBodyWithMessages;
    /**
     * Consumes an SSE/text stream Response and yield each text chunk.
     *
     * @reader request body reader
     */
    private handleStreamResponse;
}
export default GeminiProvider;
//# sourceMappingURL=GeminiProvider.d.ts.map