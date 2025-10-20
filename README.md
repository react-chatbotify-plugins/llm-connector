<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/react-chatbotify-plugins/llm-connector/main/src/assets/logo.webp" />
  <h1 align="center">LLM Connector</h1>
</p>

<p align="center">
  <a href="https://github.com/react-chatbotify-plugins/llm-connector/actions/workflows/ci-cd-pipeline.yml"> <img src="https://github.com/react-chatbotify-plugins/llm-connector/actions/workflows/ci-cd-pipeline.yml/badge.svg" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/llm-connector"> <img src="https://img.shields.io/npm/v/@rcb-plugins/llm-connector?logo=semver&label=version&color=%2331c854" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/llm-connector"> <img src="https://img.shields.io/badge/react-16--19-orange?logo=react&label=react" /> </a>
</p>

## Table of Contents

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Features](#features)
* [API Documentation](#api-documentation)
* [Team](#team)
* [Contributing](#contributing)
* [Others](#others)

### Introduction

<p align="center"">
  <img height="400px" src="https://github.com/user-attachments/assets/72813239-7bb7-4966-a1b9-0ae1d0f7c6d0" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img height="400px" src="https://github.com/user-attachments/assets/c78f88f9-bbb7-4bad-91a8-13633ce35d4a" />
</p>

**LLM Connector** is a plugin that provides out-of-the-box integrations with large language models (LLMs). The plugin ships with built-in support for 3 default LLM providers which are [**OpenAI**](docs/providers/OpenAI.md), [**Gemini**](/docs/providers/Gemini.md) and [**WebLlm (in-browser)**](/docs/providers/WebLlm.md). Developers may also create their own providers beyond those that are provided to support niche or custom use cases. The plugin also provides generalized configurations for managing streaming behavior, chat history inclusion and audio output, greatly simplifying the amount of custom logic required from developers.

For support, join the plugin community on [**Discord**](https://discord.gg/J6pA4v3AMW) to connect with other developers and get help.

### Quickstart

The plugin is incredibly straightforward to use and is [**available on npm**](https://www.npmjs.com/package/@rcb-plugins/llm-connector). Simply follow the steps below:

1. Install the plugin with the following command within your project folder:
   ```bash
   npm install @rcb-plugins/llm-connector
   ```

2. Import the plugin:
   ```javascript
   import LlmConnector from "@rcb-plugins/llm-connector";
   ```

3. Initialize the plugin within the `plugins` prop of `ChatBot`:
   ```javascript
   import ChatBot from "react-chatbotify";
   import LlmConnector from "@rcb-plugins/llm-connector";

   const MyComponent = () => {
     return (
       <ChatBot plugins=[LlmConnector()]/>
     );
   };
   ```

4. Define an `llmConnector` attribute within the [**Block**](https://react-chatbotify.com/docs/concepts/conversations#block) that requires LLM integration. Import your desired LLM provider (or create your own!) and pass it as a value to the `provider` within the `llmConnector` attribute. You may refer to the setup below which uses the [**WebLlmProvider**](/docs/providers/WebLlm.md) for a better idea (details covered later): 
   ```javascript
   import ChatBot from "react-chatbotify";
   import LlmConnector, { LlmConnectorBlock, WebLlmProvider } from "@rcb-plugins/llm-connector";

   const MyComponent = () => {
     const flow = {
       start: {
         message: "What would you like to find out today?",
         transition: 0,
         path: "llm_example_block",
       },
       llm_example_block: {
         llmConnector: {
            provider: new WebLlmProvider({
             model: 'Qwen2-0.5B-Instruct-q4f16_1-MLC',
           }),
         }
       } as LlmConnectorBlock,
       // ... other blocks as necessary
     }
     return (
       <ChatBot plugins=[LlmConnector()]/>
     );
   };
   ```

The quickstart above shows how LLM integrations can be done within the `llm_example_block`, where we rely on a default `WebLlmProvider` with minimal configurations to perform inference in the browser. The full onfiguration guide for the default providers can be found [**here**](/docs/providers/). For those who prefer more hands-on experimentation, the documentation website for the React ChatBotify Core Library also contains live examples for this plugin. You will find those examples under the [**LLM Providers**](#llm-providers) section.

### Features

**LLM Connector** is a lightweight plugin that provides the following features to your chatbot:
- Simple & Fast LLM Integrations (via common [default providers](/docs/providers/))
- Configure output behavior (e.g. stream responses by character/chunk or show full text at once)
- Configure output speed
- Configure size of message history to include
- Configure default error messages if responses fail
- Synchronized audio output (relies on core library audio configurations to read out LLM responses)
- Built-in common providers for easy integrations (OpenAI, Gemini & WebLlm)
- Ease of building your own providers for niche or custom use cases

### API Documentation

#### Plugin Configuration

The `LlmConnector` plugin accepts a configuration object that allows you to customize its behavior and appearance. An example configuration is passed in below to initialize the plugin:

```javascript
import ChatBot from "react-chatbotify";
import LlmConnector from "@rcb-plugins/llm-connector";

const MyComponent = () => {
  const pluginConfig = {
    // defaults to true, auto enable events required for plugin to work
      autoConfig: true,
  }

  return (
    <ChatBot plugins={[LlmConnector(pluginConfig)]}/>
  )
}
```

The base plugin configuration only allows a single field which is `autoConfig` (strongly recommended to keep this to `true`) which is described below:

| Configuration Option         | Type     | Default Value                                                                                                                                                                                                                 | Description                                                                                                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `autoConfig`                 | boolean  | `true`                                                                                                                                                                                                                        | Enables automatic configuration of required events. Recommended to keep as `true`. If set to `false`, you need to configure events manually. |

#### LLM Connector Attribute

The `llmConnector` attribute is added to the Block that you are keen to integrate LLM in. When you specify the `llmConnector` attribute, **all default attributes specified in the block are ignored**. This is because the `LlmConnector` plugin will take **full control over the block** to ensure a tight and smooth integration. With that said, the `llmConnector` attribute is an object that comes with its own properties as described below:

| Property         | Type     | Default Value                                                                                                                                                                                                                 | Description                                                                                                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `provider`                 | Provider | null                                                                                                                                                                                                                        | The LLM Provider to use in this block. |
| `outputType`                 | string | `chunk`                                                                                                                                                                                                                        | Output type for the LLM response (`character`, `chunk` or `full`). If set to `character` or `chunk`, output will be streamed by character or chunk respectively. If set to `full`, then the output will be sent fully in one go. |
| `outputSpeed`                | number | `30`                                                                                                                                                                                                                        | Output speed in milliseconds (applicable only if `outputType` is set to `character` or `chunk`). |
| `historySize`                 | number | `0`                                                                                                                                                                                                                        | Default number of messages from chat history to include when sending messages to LLMs. |
| `initialMessage`                 | string | ""                                                                                                                                                                                                                        | Initial message to send in the chat. |
| `waitForUserInput`                 | boolean | `true`                                                                                                                                                                                                                        | Whether to wait for user input before triggering the initial LLM prompt (if `false`, uses the user input from previous block). |
| `errorMessage`                 | string | `Unable to get response, please try again.`                                                                                                                                                                                                                        | Error message shown on failure to fetch a response. |
| `stopConditions`                 | object | null                                                                                                                                                                                                                        | An object containing possible stop conditions to end an LLM conversation (more information on stopConditions [**here**](#ending-llm-conversations)). |

#### LLM Providers

As you may have seen from earlier examples, providers are passed into the `provider` property within the `llmConnector` attribute. Providers are essentially an abstraction over the various LLM providers such as OpenAI and Gemini. With that said, configurations for providers can vary greatly depending on the choice of provider. For the default providers, their configuration guides can be found here:

- [**OpenAIProvider Configurations**](/docs/providers/OpenAI.md)
- [**GeminiProvider Configurations**](/docs/providers/Gemini.md)
- [**WebLlmProvider Configurations**](/docs/providers/WebLlm.md)

> [!TIP]  
> Note that if your choice of provider falls outside the default ones provided but has API specifications aligned to default providers (e.g. OpenAI), you may still use the default providers. 

In addition, React ChatBotify's documentation website also contains live examples covering all of these default providers. You're strongly recommended to reference these examples:

- [**OpenAI Provider Live Example**](https://react-chatbotify.com/docs/examples/openai_integration)
- [**Gemini Provider Live Example**](https://react-chatbotify.com/docs/examples/gemini_integration)
- [**WebLlm Live Example**](https://react-chatbotify.com/docs/examples/llm_conversation)

Developers may also write custom providers to integrate with their own solutions by importing and implementing the `Provider` interface. The only method enforced by the interface is `sendMessage`, which returns an `AsyncGenerator<string>` for the `LlmConnector` plugin to consume. A minimal example of a custom provider is shown below:

```javascript
import ChatBot from "react-chatbotify";
import { Provider } from "@rcb-plugins/llm-connector";

class MyCustomProvider implements Provider {
  /**
   * Streams or batch-calls Openai and yields each chunk (or the full text).
   *
   * @param messages  messages to include in the request
   * @param stream    if true, yields each token as it arrives; if false, yields one full response
   */
   public async *sendMessages(messages: Message[]): AsyncGenerator<string> {
     // obviously we should do something with the messages (e.g. call a proxy) but this is just an example
     yield "Hello World!";
   }
}
```
> [!TIP]  
> Consider referencing the implementations for the default providers [here](/src/providers/) if you're looking to create your own provider.

#### Ending LLM Conversations

Within the `llmConnector` attribute, there is a `stopConditions` property that accepts an object containing several types of stop conditions which developers may tap on to end LLM conversations. In the example below, `llm_example_block` uses both `onUserMessage` stop condition to check if the user sent a "FINISH" message, ang the `onKeyDown` stop condition to check if the "Escape" key is pressed. If either conditions are satisfied, the user is sent to the `exit_block`:

```javascript
import ChatBot from "react-chatbotify";
import LlmConnector, { LlmConnectorBlock, OpenaiProvider } from "@rcb-plugins/llm-connector";

const MyComponent = () => {
  const flow = {
    start: {
      message: "What would you like to find out today?",
      transition: 0,
      path: "llm_example_block",
    },
    llm_example_block: {
      llmConnector: {
        provider: new OpenaiProvider({
          mode: 'direct',
          model: 'gpt-4.1-nano',
          responseFormat: 'stream',
          apiKey: // openai api key here,
        }),
        stopConditions: {
          onUserMessage: (message: Message) => {
            if (
              typeof message.content === 'string' &&
              message.content.toUpperCase() === 'FINISH'
            ) {
              return 'start';
            }
          },
          onKeyDown: (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              return 'start';
            }
            return null;
          },
        },
      },
    } as LlmConnectorBlock,
    exit_block: {
      message: "The LLM conversation has ended!",
      chatDisabled: true,
      options: ["Try Again"],
      path: "llm_example_block",
    }
    // ... other blocks as necessary
  };

  return (
    <ChatBot plugins={[LlmConnector()]}/>
  )
}
```

Currently, the plugin offers 2 stop conditions that is `onUserMessage` and `onKeyDown`:

| Stop Condition         | Type     | Default Value                                                                                                                                                                                                                 | Description                                                                                                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `onUserMessage`                 | async function | `null`                                                                                                                                                                                                                        | This stop condition is triggered whenever a new message is sent by the user within the `LlmConnectorBlock`. It takes in a `Message` parameter representing the message that was sent and returns a `string` representing a path to go to or `null`, if remaining within the block. |
| `onKeyDown`                 | async function | `null`                                                                                                                                                                                                                        | This stop condition is triggered whenever a key down event is recorded (listens for keydown events). It takes in the `KeyBoardEvent` parameter and returns a `string` representing a path to go to or `null`, if remaining within the block. |

Suggestions (or even better, pull requests) are welcomed for more stop conditions!

### Team

* [Tan Jin](https://github.com/tjtanjin)

### Contributing

If you have code to contribute to the project, open a pull request from your fork and describe 
clearly the changes and what they are intended to do (enhancement, bug fixes etc). Alternatively,
you may simply raise bugs or suggestions by opening an issue.

### Others

For any questions regarding the project, please reach out for support via **[discord](https://discord.gg/J6pA4v3AMW).**
