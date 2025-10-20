## v0.4.0 (21-10-2025)

**Added:**
- Added a `waitForUserInput` property (defaults to `true`) within the `llmConnector` attribute - if set to `false`, the llm prompt will be fired upon entering the llm block (i.e. uses user input from previous block instead of waiting for the next user input)

## v0.3.2 (12-06-2025)

**Fixed:**
- Fixed an issue with autofocus applying even when embedded chatbot is out of view

## v0.3.1 (11-06-2025)

**Fixed:**
- Fixed an issue with OpenAI Provider not working with `responseFormat` set to `json`

**Added:**
- Added an optional `debug` property to all 3 default providers that prints more verbose logs that may help during development

## v0.3.0 (01-06-2025)

**Fixed:**
- Fixed an issue where the @wllama/wllama package was causing issues for some users

**Note:**

WllamaProvider is no longer shipped by default with the plugin, primarily because packaging it into the plugin causes issues that are hard to resolve plugin-side. There's also a lack of practical use case for it currently, though the default implementation is still available for users to copy into their project [**here**](https://gist.github.com/tjtanjin/345fe484c6df26c8194381d2b177f66c).

## v0.2.0 (16-05-2025)

**Fixed:**
- Fixed an issue where GeminiProvider's `responseFormat` field was required instead of optional
- Fixed an issue where stop conditions do not abort bot streaming responses
- Fixed error message not respecting output type

**Added:**
- Added an `initialMessage` property within the `llmConnector` attribute to allow users to specify an initial message easily

## v0.1.1 (13-05-2025)

**Added:**
- Initial Release