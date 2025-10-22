import { Provider } from '../types/Provider';
import { Message } from 'react-chatbotify';
/**
 * Processes the prompt using the provided model connector.
 *
 * @param messages messages to send to the LLM
 * @param refs object containing relevant refs
 * @param actions object containing relevant actions
 * @param opts optional AbortSignal
 */
declare const handlePrompt: (messages: Message[], refs: {
    providerRef: React.MutableRefObject<Provider | null>;
    messagesRef: React.MutableRefObject<Message[]>;
    outputTypeRef: React.MutableRefObject<"character" | "chunk" | "full">;
    outputSpeedRef: React.MutableRefObject<number>;
    historySizeRef: React.MutableRefObject<number>;
    initialMessageRef: React.MutableRefObject<string>;
    errorMessageRef: React.MutableRefObject<string>;
    onUserMessageRef: React.MutableRefObject<((msg: Message) => Promise<string | null>) | null>;
    onKeyDownRef: React.MutableRefObject<((e: KeyboardEvent) => Promise<string | null>) | null>;
}, actions: {
    speakAudio: (text: string) => void;
    injectMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
    simulateStreamMessage: (content: string, sender?: string) => Promise<Message | null>;
    streamMessage: (msg: string) => void;
    endStreamMessage: () => void;
    toggleTextAreaDisabled: (active?: boolean) => void;
    toggleIsBotTyping: (active?: boolean) => void;
    focusTextArea: () => void;
    goToPath: (path: string) => void;
    getIsChatBotVisible: () => boolean;
}, opts?: {
    signal?: AbortSignal;
}) => Promise<void>;
export { handlePrompt };
//# sourceMappingURL=promptHandler.d.ts.map