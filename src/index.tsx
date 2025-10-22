// plugin import
import LlmConnector from './factory/RcbPluginFactory';

// provider imports
import GeminiProvider from './providers/GeminiProvider';
import OpenaiProvider from './providers/OpenaiProvider';
import WebLlmProvider from './providers/WebLlmProvider';
import OllamaProvider from './providers/OllamaProvider';

// type imports
import { LlmConnectorBlock } from './types/LlmConnectorBlock';
import { PluginConfig } from './types/PluginConfig';
import { Provider } from './types/Provider';

// default provider exports
export { GeminiProvider, OpenaiProvider, WebLlmProvider, OllamaProvider };

// type exports
export type { LlmConnectorBlock, PluginConfig, Provider };

// plugin export
export default LlmConnector;
