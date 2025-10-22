import { Provider } from '../types/Provider';
import { Message } from 'react-chatbotify';
import { OpenaiProviderConfig } from '../types/provider-config/OpenaiProviderConfig';
import { OllamaProviderMessage } from '../types/provider-message/OllamaProviderMessage';

/**
 * Provider for Ollama’s API, supports both direct and proxy modes.
 */
class OllamaProvider implements Provider {
	private method!: string;
	private endpoint!: string;
	private headers!: Record<string, unknown>;
	private body!: Record<string, unknown>;
	private systemMessage?: string;
	private responseFormat!: 'stream' | 'json';
	private messageParser?: (messages: Message[]) => OllamaProviderMessage[];
	private debug: boolean = false;

	/**
	 * Sets default values for the provider based on given configuration. Configuration guide here:
	 * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/OpenAI.md
	 *
	 * @param config configuration for setup
	 */
	public constructor(config: OpenaiProviderConfig) {
		this.method = config.method ?? 'POST';
		this.endpoint = config.baseUrl ?? 'http://localhost:11434/api/chat';
		this.systemMessage = config.systemMessage;
		this.responseFormat = config.responseFormat ?? 'stream';
		this.messageParser = config.messageParser;
		this.debug = config.debug ?? false;
		this.headers = {
			'Content-Type': 'application/json',
			Accept: this.responseFormat === 'stream' ? 'text/event-stream' : 'application/json',
			...config.headers,
		};
		this.body = {
			model: config.model,
			stream: this.responseFormat === 'stream',
			...config.body,
		};

		if (config.mode === 'direct') {
			this.headers = { ...this.headers, Authorization: `Bearer ${config.apiKey}` };
			return;
		}

		if (config.mode !== 'proxy') {
			throw Error("Invalid mode specified for Ollama provider ('direct' or 'proxy').");
		}
	}

	/**
	 * Calls Ollama and yields each chunk (or the full text).
	 *
	 * @param messages messages to include in the request
	 */
	public async *sendMessages(messages: Message[]): AsyncGenerator<string> {
		if (this.debug) {
			const sanitizedHeaders = { ...this.headers };
			delete sanitizedHeaders['Authorization'];
			console.log('[OllamaProvider] Request:', {
				method: this.method,
				endpoint: this.endpoint,
				headers: sanitizedHeaders,
				body: this.constructBodyWithMessages(messages),
			});
		}
		const res = await fetch(this.endpoint, {
			method: this.method,
			headers: this.headers as HeadersInit,
			body: JSON.stringify(this.constructBodyWithMessages(messages)),
		});

		if (this.debug) {
			console.log('[OllamaProvider] Response status:', res.status);
		}

		if (!res.ok) {
			throw new Error(`Ollama API error ${res.status}: ${await res.text()}`);
		}

		if (this.responseFormat === 'stream') {
			if (!res.body) {
				throw new Error('Response body is empty – cannot stream');
			}
			const reader = res.body.getReader();
			for await (const chunk of this.handleStreamResponse(reader)) {
				yield chunk;
			}
		} else {
			const payload = await res.json();
			if (this.debug) {
				console.log('[OllamaProvider] Response body:', payload);
			}
			const text = payload.choices?.[0]?.message?.content;
			if (typeof text === 'string') {
				yield text;
			} else {
				throw new Error('Unexpected response shape – no text candidate');
			}
		}
	}

	/**
	 * Maps the chatbot message sender to the provider message sender.
	 *
	 * @param sender sender from the chatbot
	 */
	private roleMap = (sender: string): 'system' | 'user' | 'assistant' => {
		switch (sender) {
			case 'USER':
				return 'user';
			case 'SYSTEM':
				return 'system';
			default:
				return 'assistant';
		}
	};

	/**
	 * Builds the full request body.
	 *
	 * @param messages messages to parse
	 */
	private constructBodyWithMessages = (messages: Message[]) => {
		let parsedMessages;
		if (this.messageParser) {
			parsedMessages = this.messageParser(messages);
		} else {
			const filteredMessages = messages.filter(
				(message) => typeof message.content === 'string' && message.sender.toUpperCase() !== 'SYSTEM'
			);
			parsedMessages = filteredMessages.map((message) => {
				const role = this.roleMap(message.sender.toUpperCase());
				const text = message.content;
				return {
					role,
					content: text,
				};
			});
		}

		// append system message if specified
		if (this.systemMessage) {
			parsedMessages = [{ role: 'system', content: this.systemMessage }, ...parsedMessages];
		}

		// Only include model and messages for Ollama
		return {
			model: this.body.model,
			messages: parsedMessages,
		};
	};

	/**
	 * Consumes an SSE/text stream Response and yield each text chunk.
	 *
	 * @reader request body reader
	 */
	private handleStreamResponse = async function* (
		reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>
	): AsyncGenerator<string> {
		const decoder = new TextDecoder('utf-8');
		let buffer = '';

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const parts = buffer.split(/\r?\n/);
			buffer = parts.pop()!;

			for (const line of parts) {
				try {
					const event = JSON.parse(line);
					if (event.done === true) return;
					if (event.message && typeof event.message.content === 'string') {
						yield event.message.content;
					}
				} catch (err) {
					console.error('Stream parse error', err);
				}
			}
		}
	};
}

export default OllamaProvider;
