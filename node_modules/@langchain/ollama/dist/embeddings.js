import { Embeddings } from "@langchain/core/embeddings";
import { Ollama } from "ollama/browser";
export class OllamaEmbeddings extends Embeddings {
    constructor(fields) {
        super({ maxConcurrency: 1, ...fields });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "mxbai-embed-large"
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
        Object.defineProperty(this, "requestOptions", {
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
        Object.defineProperty(this, "truncate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.client = new Ollama({
            host: fields?.baseUrl,
            headers: fields?.headers ? new Headers(fields.headers) : undefined,
        });
        this.baseUrl = fields?.baseUrl ?? this.baseUrl;
        this.model = fields?.model ?? this.model;
        this.keepAlive = fields?.keepAlive;
        this.truncate = fields?.truncate ?? this.truncate;
        this.requestOptions = fields?.requestOptions
            ? this._convertOptions(fields?.requestOptions)
            : undefined;
    }
    /** convert camelCased Ollama request options like "useMMap" to
     * the snake_cased equivalent which the ollama API actually uses.
     * Used only for consistency with the llms/Ollama and chatModels/Ollama classes
     */
    _convertOptions(requestOptions) {
        const snakeCasedOptions = {};
        const mapping = {
            embeddingOnly: "embedding_only",
            frequencyPenalty: "frequency_penalty",
            keepAlive: "keep_alive",
            logitsAll: "logits_all",
            lowVram: "low_vram",
            mainGpu: "main_gpu",
            mirostat: "mirostat",
            mirostatEta: "mirostat_eta",
            mirostatTau: "mirostat_tau",
            numBatch: "num_batch",
            numCtx: "num_ctx",
            numGpu: "num_gpu",
            numKeep: "num_keep",
            numPredict: "num_predict",
            numThread: "num_thread",
            penalizeNewline: "penalize_newline",
            presencePenalty: "presence_penalty",
            repeatLastN: "repeat_last_n",
            repeatPenalty: "repeat_penalty",
            temperature: "temperature",
            stop: "stop",
            tfsZ: "tfs_z",
            topK: "top_k",
            topP: "top_p",
            typicalP: "typical_p",
            useMlock: "use_mlock",
            useMmap: "use_mmap",
            vocabOnly: "vocab_only",
            f16Kv: "f16_kv",
            numa: "numa",
            seed: "seed",
        };
        for (const [key, value] of Object.entries(requestOptions)) {
            const snakeCasedOption = mapping[key];
            if (snakeCasedOption) {
                snakeCasedOptions[snakeCasedOption] = value;
            }
            else {
                // Just pass unknown options through
                snakeCasedOptions[key] = value;
            }
        }
        return snakeCasedOptions;
    }
    async embedDocuments(texts) {
        return this.embeddingWithRetry(texts);
    }
    async embedQuery(text) {
        return (await this.embeddingWithRetry([text]))[0];
    }
    async embeddingWithRetry(texts) {
        const res = await this.caller.call(() => this.client.embed({
            model: this.model,
            input: texts,
            keep_alive: this.keepAlive,
            options: this.requestOptions,
            truncate: this.truncate,
        }));
        return res.embeddings;
    }
}
