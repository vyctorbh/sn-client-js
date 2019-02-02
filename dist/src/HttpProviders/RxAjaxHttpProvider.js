"use strict";
/**
 * @module HttpProviders
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
const Config_1 = require("../Config");
const _1 = require("./");
require("rxjs/add/observable/dom/ajax");
/**
 * This is the default RxJs-Ajax based Http calls.
 */
class RxAjaxHttpProvider extends _1.BaseHttpProvider {
    uploadInner(returnType, File, options) {
        const subject = new Subject_1.Subject();
        const formData = new FormData();
        formData.append(File.name, File);
        for (const index in options.body) {
            formData.append(index, options.body[index]);
        }
        const request = new XMLHttpRequest();
        request.withCredentials = this.isCrossDomain(options.url);
        request.open('POST', options.url);
        for (const header in options.headers) {
            request.setRequestHeader(header, options.headers[header]);
        }
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                switch (request.status) {
                    case 200:
                        try {
                            const responseResult = JSON.parse(request.response);
                            subject.next(responseResult);
                        }
                        catch (error) {
                            subject.next(request.response);
                        }
                        break;
                    default:
                        subject.error({ message: 'Invalid Request status', request });
                }
            }
        };
        request.send(formData);
        return subject.asObservable();
    }
    isCrossDomain(path) {
        return path.indexOf(Config_1.SnConfigModel.DEFAULT_BASE_URL) === -1;
    }
    constructor() {
        super();
        this.SetGlobalHeader('content-type', 'application/json; charset=utf-8');
        this.SetGlobalHeader('Accept', 'application/json');
    }
    ajaxInner(tReturnType, options) {
        const crossDomain = this.isCrossDomain(options.url || '');
        options.withCredentials = crossDomain;
        options.crossDomain = crossDomain;
        return Observable_1.Observable.ajax(options).map((req) => req.response).share();
    }
}
exports.RxAjaxHttpProvider = RxAjaxHttpProvider;
//# sourceMappingURL=RxAjaxHttpProvider.js.map