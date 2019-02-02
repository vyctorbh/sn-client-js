/**
 * @module HttpProviders
 */ /** */
import { Observable } from 'rxjs/Observable';
import { AjaxRequest } from 'rxjs/observable/dom/AjaxObservable';
import { BaseHttpProvider } from './';
import 'rxjs/add/observable/dom/ajax';
/**
 * This is the default RxJs-Ajax based Http calls.
 */
export declare class RxAjaxHttpProvider extends BaseHttpProvider {
    protected uploadInner<T>(returnType: new (...args: any[]) => T, File: File, options: AjaxRequest & {
        url: string;
        headers: string[];
        body: any;
    }): Observable<T>;
    private isCrossDomain(path);
    constructor();
    protected ajaxInner<T>(tReturnType: {
        new (...args: any[]): T;
    }, options: AjaxRequest): Observable<T>;
}
