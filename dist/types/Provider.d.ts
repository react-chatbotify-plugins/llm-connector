import { Message } from 'react-chatbotify';
/**
 * Interface that all LLM providers must implement.
 */
export type Provider = {
    /**
     * Sends a series of messages to the LLM to get a reply.
     *
     * @param messages messages to send
     */
    sendMessages(messages: Message[]): AsyncGenerator<string>;
};
//# sourceMappingURL=Provider.d.ts.map