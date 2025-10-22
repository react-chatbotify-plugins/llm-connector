/**
 * Formats a raw stream according to the specified mode.
 *
 * @param stream raw async iterable stream of strings.
 * @param outputType 'character' for per-character output, 'chunk' for as-is.
 * @param outputSpeed speed in milliseconds to stream response
 */
declare const formatStream: (stream: AsyncGenerator<string>, outputType: "chunk" | "character" | "full", outputSpeed: number) => AsyncGenerator<string>;
export { formatStream };
//# sourceMappingURL=streamController.d.ts.map