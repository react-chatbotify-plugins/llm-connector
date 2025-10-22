import { WebLlmProviderConfig } from '../types/provider-config/WebLlmProviderConfig';
import { Provider } from '../types/Provider';
import { Message } from 'react-chatbotify';
/**
 * Provider for MLC’s WebLLM runtime, for running models in the browser.
 */
declare class WebLlmProvider implements Provider {
    private model;
    private systemMessage?;
    private responseFormat;
    private engineConfig;
    private chatCompletionOptions;
    private messageParser?;
    private engine?;
    private debug;
    /**
     * Sets default values for the provider based on given configuration. Configuration guide here:
     * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/WebLlm.md
     *
     * @param config configuration for setup
     */
    constructor(config: WebLlmProviderConfig);
    /**
     * Creates MLC Engine for inferencing.
     */
    private createEngine;
    /**
     * Calls WebLlm and yields each chunk (or the full text).
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
}
export default WebLlmProvider;
//# sourceMappingURL=WebLlmProvider.d.ts.map