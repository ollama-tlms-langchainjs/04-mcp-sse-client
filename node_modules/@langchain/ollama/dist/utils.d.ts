import { AIMessageChunk, BaseMessage, UsageMetadata } from "@langchain/core/messages";
import type { Message as OllamaMessage } from "ollama";
export declare function convertOllamaMessagesToLangChain(messages: OllamaMessage, extra?: {
    responseMetadata?: Record<string, any>;
    usageMetadata?: UsageMetadata;
}): AIMessageChunk;
export declare function convertToOllamaMessages(messages: BaseMessage[]): OllamaMessage[];
