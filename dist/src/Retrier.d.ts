/**
 * @module Retrier
 * @preferred
 *
 * @description Module for Retrier.
 *
 */ /** */
/**
 * Options class for Retrier
 */
export declare class RetrierOptions {
    static readonly RETRIES_DEFAULT: number;
    private _retries;
    /**
     * How many times should retry the operation
     */
    Retries: number;
    static readonly RETRY_INTERVAL_MS_DEFAULT: number;
    private _retryIntervalMs;
    /**
     * The interval between tries in milliseconds
     */
    RetryIntervalMs: number;
    static readonly TIMEOUT_MS_DEFAULT: number;
    private _timeoutMs;
    /**
     * The Timeout interval in milliseconds
     */
    TimeoutMs: number;
    /**
     * Optional callback, triggered right before each try
     */
    OnTry?: () => void;
    /**
     * Optional callback, triggered on success
     */
    OnSuccess?: () => void;
    /**
     * Optional callback, triggered on fail (timeout or too many retries)
     */
    OnFail?: () => void;
}
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
export declare class Retrier {
    private _callback;
    readonly Options: RetrierOptions;
    private _isRunning;
    /**
     * Factory method for creating a Retrier
     * @param {()=>Promise<boolean>} callback The method that will be invoked on each try
     */
    static Create(callback: () => Promise<boolean>): Retrier;
    private constructor();
    private wait(ms);
    /**
     * Method to override the default Retrier settings.
     * @param {Partial<RetrierOptions>} options The options to be overridden
     * @throws Error if the Retrier is running.
     * @returns the Retrier instance
     */
    Setup(options: Partial<RetrierOptions>): this;
    /**
     * Public method that starts the Retrier
     * @throws Error if the Retrier is already started.
     * @returns {Promise<boolean>} A boolean value that indicates if the process has been succeeded.
     */
    Run(): Promise<boolean>;
}
