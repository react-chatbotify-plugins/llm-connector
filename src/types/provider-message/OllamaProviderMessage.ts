/**
 * Message format for OpenAI.
 */
type OllamaProviderMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

export type { OllamaProviderMessage };
