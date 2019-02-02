"use strict";
/**
 * @module Mocks
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const ReplaySubject_1 = require("rxjs/ReplaySubject");
const HttpProviders_1 = require("../../src/HttpProviders");
/**
 * This HttpProvider can be used for test purposes only, it doesn't make any API calls
 */
class MockResponse {
}
exports.MockResponse = MockResponse;
class MockHttpProvider extends HttpProviders_1.BaseHttpProvider {
    constructor() {
        super(...arguments);
        this._responseQueue = [];
        this.RequestLog = [];
        this.UseTimeout = true;
    }
    uploadInner(returnType, File, options) {
        const subject = new ReplaySubject_1.ReplaySubject();
        this.UseTimeout ? setTimeout(() => this.runMocks(subject, options)) : this.runMocks(subject, options);
        return subject.asObservable();
    }
    get ActualHeaders() {
        return this._headers;
    }
    AddResponse(response) {
        this._responseQueue.push({ IsError: false, Response: response });
        return this;
    }
    AddError(error) {
        this._responseQueue.push({ IsError: true, Response: error });
        return this;
    }
    runMocks(subject, options) {
        const response = this._responseQueue[0];
        if (response) {
            this.RequestLog.push({ Response: response, Options: options });
            if (response.IsError) {
                subject.error(response.Response);
            }
            else {
                subject.next(response.Response);
            }
            this._responseQueue.splice(0, 1);
        }
    }
    get LastOptions() {
        return this.RequestLog[this.RequestLog.length - 1].Options;
    }
    ajaxInner(tReturnType, options) {
        const subject = new ReplaySubject_1.ReplaySubject();
        this.UseTimeout ? setTimeout(() => this.runMocks(subject, options)) : this.runMocks(subject, options);
        return subject.asObservable();
    }
}
exports.MockHttpProvider = MockHttpProvider;
//# sourceMappingURL=MockHttpProvider.js.map