/**
 * @module Mocks
 */ /** */
import { Observable } from 'rxjs/Observable';
import { AjaxRequest } from 'rxjs/observable/dom/AjaxObservable';
import { BaseHttpProvider } from '../../src/HttpProviders';
/**
 * This HttpProvider can be used for test purposes only, it doesn't make any API calls
 */
export declare class MockResponse {
    IsError: boolean;
    Response: any;
}
export declare class MockHttpProvider extends BaseHttpProvider {
    private _responseQueue;
    readonly RequestLog: {
        Options: AjaxRequest;
        Response: MockResponse;
    }[];
    protected uploadInner<T>(returnType: new (...args: any[]) => T, File: File, options?: (AjaxRequest & {
        url: string;
    })): Observable<T>;
    readonly ActualHeaders: Map<string, string>;
    AddResponse(response: any): this;
    AddError(error: any): this;
    UseTimeout: boolean;
    private runMocks<T>(subject, options);
    readonly LastOptions: AjaxRequest;
    protected ajaxInner<T>(tReturnType: new (...args: any[]) => T, options: AjaxRequest): Observable<T>;
}
