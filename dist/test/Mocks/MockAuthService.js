"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Mocks
 */ /** */
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Observable_1 = require("rxjs/Observable");
const ReplaySubject_1 = require("rxjs/ReplaySubject");
const Authentication_1 = require("../../src/Authentication");
class MockAuthService {
    constructor() {
        this._oauthProviders = new Map();
        this.CurrentUser = 'BuiltIn\\Visitor';
        this.StateSubject = new BehaviorSubject_1.BehaviorSubject(Authentication_1.LoginState.Pending);
    }
    HandleAuthenticationResponse(response, resp = true) {
        return resp;
    }
    SetOauthProvider(provider) {
        const providerCtor = provider.constructor;
        if (this._oauthProviders.has(providerCtor)) {
            throw Error(`Provider for '${providerCtor.name}' already set`);
        }
        this._oauthProviders.set(providerCtor, provider);
    }
    GetOauthProvider(providerType) {
        if (!this._oauthProviders.has(providerType)) {
            throw Error(`OAuth provider not found for '${providerType.name}'`);
        }
        return this._oauthProviders.get(providerType);
    }
    get State() {
        return this.StateSubject.asObservable();
    }
    get CurrentState() {
        return this.StateSubject.value;
    }
    CheckForUpdate() {
        return Observable_1.Observable.from([false]);
    }
    Login(username, password) {
        const subject = new ReplaySubject_1.ReplaySubject();
        if (username === this.ValidUserName && password === this.ValidPassword) {
            subject.next(true);
        }
        else {
            subject.next(false);
        }
        return subject.asObservable();
    }
    Logout() {
        return Observable_1.Observable.from([true]);
    }
}
exports.MockAuthService = MockAuthService;
//# sourceMappingURL=MockAuthService.js.map