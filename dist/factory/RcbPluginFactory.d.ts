import { PluginConfig } from '../types/PluginConfig';
/**
 * Factory that prepares the plugin hook to be consumed by the core library.
 *
 * @param pluginConfig configurations for the plugin
 */
declare const RcbPluginFactory: (pluginConfig?: PluginConfig) => () => {
    name: string;
    settings?: import("react-chatbotify").Settings;
    styles?: import("react-chatbotify").Styles;
};
export default RcbPluginFactory;
//# sourceMappingURL=RcbPluginFactory.d.ts.map