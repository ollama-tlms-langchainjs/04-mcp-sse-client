"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ollama = void 0;
const outputs_1 = require("@langchain/core/outputs");
const llms_1 = require("@langchain/core/language_models/llms");
const browser_1 = require("ollama/browser");
/**
 * Class that represents the Ollama language model. It extends the base
 * LLM class and implements the OllamaInput interface.
 * @example
 * ```typescript
 * const ollama = new Ollama({
 *   baseUrl: "http://api.example.com",
 *   model: "llama3",
 * });
 *
 * // Streaming translation from English to German
 * const stream = await ollama.stream(
 *   `Translate "I love programming" into German.`
 * );
 *
 * const chunks = [];
 * for await (const chunk of stream) {
 *   chunks.push(chunk);
 * }
 *
 * console.log(chunks.join(""));
 * ```
 */
class Ollama extends llms_1.LLM {
    static lc_name() {
        return "Ollama";
    }
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "llama3"
        });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "http://localhost:11434"
        });
        Object.defineProperty(this, "keepAlive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "f16KV", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "frequencyPenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "logitsAll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lowVram", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mainGpu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mirostat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mirostatEta", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mirostatTau", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numBatch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numCtx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numGpu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numKeep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numPredict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numThread", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "penalizeNewline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "presencePenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "repeatLastN", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "repeatPenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tfsZ", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "typicalP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "useMLock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "useMMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vocabOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "format", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = fields?.model ?? this.model;
        this.baseUrl = fields?.baseUrl?.endsWith("/")
            ? fields?.baseUrl.slice(0, -1)
            : fields?.baseUrl ?? this.baseUrl;
        this.client = new browser_1.Ollama({
            host: this.baseUrl,
            headers: fields?.headers,
        });
        this.keepAlive = fields?.keepAlive;
        this.embeddingOnly = fields?.embeddingOnly;
        this.f16KV = fields?.f16Kv;
        this.frequencyPenalty = fields?.frequencyPenalty;
        this.logitsAll = fields?.logitsAll;
        this.lowVram = fields?.lowVram;
        this.mainGpu = fields?.mainGpu;
        this.mirostat = fields?.mirostat;
        this.mirostatEta = fields?.mirostatEta;
        this.mirostatTau = fields?.mirostatTau;
        this.numBatch = fields?.numBatch;
        this.numCtx = fields?.numCtx;
        this.numGpu = fields?.numGpu;
        this.numKeep = fields?.numKeep;
        this.numPredict = fields?.numPredict;
        this.numThread = fields?.numThread;
        this.penalizeNewline = fields?.penalizeNewline;
        this.presencePenalty = fields?.presencePenalty;
        this.repeatLastN = fields?.repeatLastN;
        this.repeatPenalty = fields?.repeatPenalty;
        this.temperature = fields?.temperature;
        this.stop = fields?.stop;
        this.tfsZ = fields?.tfsZ;
        this.topK = fields?.topK;
        this.topP = fields?.topP;
        this.typicalP = fields?.typicalP;
        this.useMLock = fields?.useMlock;
        this.useMMap = fields?.useMmap;
        this.vocabOnly = fields?.vocabOnly;
        this.format = fields?.format;
    }
    _llmType() {
        return "ollama";
    }
    invocationParams(options) {
        return {
            model: this.model,
            format: this.format,
            keep_alive: this.keepAlive,
            images: options?.images,
            options: {
                embedding_only: this.embeddingOnly,
                f16_kv: this.f16KV,
                frequency_penalty: this.frequencyPenalty,
                logits_all: this.logitsAll,
                low_vram: this.lowVram,
                main_gpu: this.mainGpu,
                mirostat: this.mirostat,
                mirostat_eta: this.mirostatEta,
                mirostat_tau: this.mirostatTau,
                num_batch: this.numBatch,
                num_ctx: this.numCtx,
                num_gpu: this.numGpu,
                num_keep: this.numKeep,
                num_predict: this.numPredict,
                num_thread: this.numThread,
                penalize_newline: this.penalizeNewline,
                presence_penalty: this.presencePenalty,
                repeat_last_n: this.repeatLastN,
                repeat_penalty: this.repeatPenalty,
                temperature: this.temperature,
                stop: options?.stop ?? this.stop,
                tfs_z: this.tfsZ,
                top_k: this.topK,
                top_p: this.topP,
                typical_p: this.typicalP,
                use_mlock: this.useMLock,
                use_mmap: this.useMMap,
                vocab_only: this.vocabOnly,
            },
        };
    }
    async *_streamResponseChunks(prompt, options, runManager) {
        const stream = await this.caller.call(async () => this.client.generate({
            ...this.invocationParams(options),
            prompt,
            stream: true,
        }));
        for await (const chunk of stream) {
            if (options.signal?.aborted) {
                throw new Error("This operation was aborted");
            }
            if (!chunk.done) {
                yield new outputs_1.GenerationChunk({
                    text: chunk.response,
                    generationInfo: {
                        ...chunk,
                        response: undefined,
                    },
                });
                await runManager?.handleLLMNewToken(chunk.response ?? "");
            }
            else {
                yield new outputs_1.GenerationChunk({
                    text: "",
                    generationInfo: {
                        model: chunk.model,
                        total_duration: chunk.total_duration,
                        load_duration: chunk.load_duration,
                        prompt_eval_count: chunk.prompt_eval_count,
                        prompt_eval_duration: chunk.prompt_eval_duration,
                        eval_count: chunk.eval_count,
                        eval_duration: chunk.eval_duration,
                    },
                });
            }
        }
    }
    /** @ignore */
    async _call(prompt, options, runManager) {
        const chunks = [];
        for await (const chunk of this._streamResponseChunks(prompt, options, runManager)) {
            chunks.push(chunk.text);
        }
        return chunks.join("");
    }
}
exports.Ollama = Ollama;
