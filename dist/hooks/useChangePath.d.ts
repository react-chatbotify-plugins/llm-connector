import { Flow } from 'react-chatbotify';
import { LlmConnectorBlock } from '../types/LlmConnectorBlock';
/**
 * Handles changing of conversation path (block).
 *
 * @param getFlow flow of the chatbot
 * @param setConnectorBlockFields sets all fields required for llm connector block
 */
declare const useChangePath: (getFlow: () => Flow, setConnectorBlockFields: (block: LlmConnectorBlock) => void) => void;
export { useChangePath };
//# sourceMappingURL=useChangePath.d.ts.map