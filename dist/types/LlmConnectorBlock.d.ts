import { Block, Message } from 'react-chatbotify';
import { Provider } from './Provider';
/**
 * Extends the Block from React ChatBotify to support the llm connector attribute and its properties.
 */
export type LlmConnectorBlock = Block & {
    llmConnector: {
        provider: Provider;
        outputType?: 'character' | 'chunk' | 'full';
        outputSpeed?: number;
        historySize?: number;
        initialMessage?: string;
        errorMessage?: string;
        stopConditions?: {
            onUserMessage?: (message: Message) => Promise<string | null>;
            onKeyDown?: (event: KeyboardEvent) => Promise<string | null>;
        };
    };
};
//# sourceMappingURL=LlmConnectorBlock.d.ts.map