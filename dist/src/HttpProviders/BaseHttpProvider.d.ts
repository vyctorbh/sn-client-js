/**
 * @module HttpProviders
 */ /** */
import { Observable } from 'rxjs/Observable';
import { AjaxRequest } from 'rxjs/observable/dom/AjaxObservable';
/**
 *
 */
export declare abstract class BaseHttpProvider {
    protected _headers: Map<string, string>;
    /**
     * Sets a specified HTTP header to a specified value. The header will be the same on each request.
     * @param headerName The name of the header
     * @param headerValue The value of the header
     */
    SetGlobalHeader(headerName: string, headerValue: string): void;
    /**
     * Removes a specified HTTP header from the global header settings
     * @param headerName The name of the header
     *
     */
    UnsetGlobalHeader(headerName: string): void;
    /**
     * Public entry point for executing Ajax calls using a specific provider
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    Ajax<T>(tReturnType: {
        new (...args: any[]): T;
    }, options: AjaxRequest, additionalHeaders?: {
        name: string;
        value: string;
    }[]): Observable<T>;
    /**
     * Public entry point for uploading files using a specific provider
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    Upload<T>(tReturnType: {
        new (...args: any[]): T;
    }, File: File, options: AjaxRequest & {
        url: string;
    }): Observable<T>;
    /**
     * The inner implementation of the Ajax call
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    protected abstract ajaxInner<T>(tReturnType: {
        new (...args: any[]): T;
    }, options?: AjaxRequest): Observable<T>;
    /**
     * The implementation of the Upload call
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    protected abstract uploadInner<T>(returnType: {
        new (...args: any[]): T;
    }, File: File, options?: AjaxRequest & {
        url: string;
    }): Observable<T>;
}
