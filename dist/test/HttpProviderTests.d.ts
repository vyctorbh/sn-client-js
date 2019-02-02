/// <reference types="mocha" />
export declare class HttpProviderTests {
    private readonly _testHeaderName;
    private readonly _testHeaderValue;
    SetGlobalHeaders(): void;
    UnsetGlobalHeaders(): void;
    'globalHeaders should override options.headers'(): void;
    'globalHeaders should be overridden by additional headers'(): void;
    'RxHttpProvider Ajax should make an XmlHttpRequest call'(done: MochaDone): void;
    'RxHttpProvider Upload should make an XmlHttpRequest call and parses response if possible'(done: MochaDone): void;
    'RxHttpProvider Upload should make an XmlHttpRequest call and returns raw response if failed to parse'(done: MochaDone): void;
    'RxHttpProvider Upload should distribute an Error if the request has an invalid status'(done: MochaDone): void;
}
