"use strict";
/**
 * @module HttpProviders
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class BaseHttpProvider {
    constructor() {
        this._headers = new Map();
    }
    /**
     * Sets a specified HTTP header to a specified value. The header will be the same on each request.
     * @param headerName The name of the header
     * @param headerValue The value of the header
     */
    SetGlobalHeader(headerName, headerValue) {
        this._headers.set(headerName, headerValue);
    }
    /**
     * Removes a specified HTTP header from the global header settings
     * @param headerName The name of the header
     *
     */
    UnsetGlobalHeader(headerName) {
        this._headers.delete(headerName);
    }
    /**
     * Public entry point for executing Ajax calls using a specific provider
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    Ajax(tReturnType, options, additionalHeaders = []) {
        const headers = options.headers || [];
        for (const key of this._headers.keys()) {
            headers[key] = this._headers.get(key);
        }
        additionalHeaders.forEach((h) => {
            headers[h.name] = h.value;
        });
        options.headers = headers;
        return this.ajaxInner(tReturnType, options);
    }
    /**
     * Public entry point for uploading files using a specific provider
     * @param tReturnType The return type
     * @param options Additional RxJs AjaxRequest options (the global headers will be overridden)
     */
    Upload(tReturnType, File, options) {
        options.headers = options.headers || [];
        return this.uploadInner(tReturnType, File, options);
    }
}
exports.BaseHttpProvider = BaseHttpProvider;
//# sourceMappingURL=BaseHttpProvider.js.map