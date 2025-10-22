import { Message } from 'react-chatbotify';
import { Provider } from '../types/Provider';
/**
 * Handles message events.
 *
 * @param refs object containing relevant refs
 * @param actions object containing relevant actions
 */
declare const useMessageHandler: (refs: {
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
}) => void;
export { useMessageHandler };
//# sourceMappingURL=useMessageHandler.d.ts.map