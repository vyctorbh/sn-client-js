"use strict";
/**
 * @module Retrier
 * @preferred
 *
 * @description Module for Retrier.
 *
 */ /** */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Options class for Retrier
 */
class RetrierOptions {
    constructor() {
        this._retries = RetrierOptions.RETRIES_DEFAULT;
    }
    /**
     * How many times should retry the operation
     */
    get Retries() {
        return this._retries !== undefined ? this._retries : RetrierOptions.RETRIES_DEFAULT;
    }
    set Retries(v) {
        this._retries = v;
    }
    /**
     * The interval between tries in milliseconds
     */
    get RetryIntervalMs() {
        return this._retryIntervalMs !== undefined ? this._retryIntervalMs : RetrierOptions.RETRY_INTERVAL_MS_DEFAULT;
    }
    set RetryIntervalMs(v) {
        this._retryIntervalMs = v;
    }
    /**
     * The Timeout interval in milliseconds
     */
    get TimeoutMs() {
        return this._timeoutMs !== undefined ? this._timeoutMs : RetrierOptions.TIMEOUT_MS_DEFAULT;
    }
    set TimeoutMs(v) {
        this._timeoutMs = v;
    }
}
RetrierOptions.RETRIES_DEFAULT = 10;
RetrierOptions.RETRY_INTERVAL_MS_DEFAULT = 10;
RetrierOptions.TIMEOUT_MS_DEFAULT = 1000;
exports.RetrierOptions = RetrierOptions;
/**
 * Utility class for retrying operations.
 * Usage example:
 * ```
 *          const funcToRetry: () => Promise<boolean> = async () => {
 *              let hasSucceeded = false;
 *              // ...
 *              // custom logic
 *              // ...
 *              return hasSucceeded;
 *          }
 *          const retrierSuccess = await Retrier.Create(funcToRetry)
 *              .Setup({
 *                  retries: 3,
 *                  retryIntervalMs: 1,
 *                  timeoutMs: 1000
 *              })
 *              .Run();
 * ```
 */
class Retrier {
    constructor(_callback, Options) {
        this._callback = _callback;
        this.Options = Options;
        this._isRunning = false;
    }
    /**
     * Factory method for creating a Retrier
     * @param {()=>Promise<boolean>} callback The method that will be invoked on each try
     */
    static Create(callback) {
        return new Retrier(callback, new RetrierOptions());
    }
    wait(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            });
        });
    }
    /**
     * Method to override the default Retrier settings.
     * @param {Partial<RetrierOptions>} options The options to be overridden
     * @throws Error if the Retrier is running.
     * @returns the Retrier instance
     */
    Setup(options) {
        if (this._isRunning) {
            throw Error('Retrier already started!');
        }
        Object.assign(this.Options, options);
        return this;
    }
    /**
     * Public method that starts the Retrier
     * @throws Error if the Retrier is already started.
     * @returns {Promise<boolean>} A boolean value that indicates if the process has been succeeded.
     */
    Run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isRunning) {
                throw Error('Retrier already started!');
            }
            let succeeded = false;
            let retries = 0;
            let timedOut = false;
            this._isRunning = true;
            setTimeout(() => {
                if (!succeeded) {
                    timedOut = true;
                }
            }, this.Options.TimeoutMs);
            while (!succeeded && !timedOut && (this.Options.Retries > retries)) {
                retries++;
                if (this.Options.OnTry) {
                    this.Options.OnTry();
                }
                succeeded = yield this._callback();
                if (!succeeded) {
                    yield this.wait(this.Options.RetryIntervalMs);
                }
            }
            if (succeeded) {
                if (!timedOut && this.Options.OnSuccess) {
                    this.Options.OnSuccess();
                }
            }
            else {
                if (this.Options.OnFail) {
                    this.Options.OnFail();
                }
            }
            return succeeded;
        });
    }
}
exports.Retrier = Retrier;
//# sourceMappingURL=Retrier.js.map