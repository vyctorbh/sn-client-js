"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const Authentication_1 = require("../src/Authentication");
const expect = Chai.expect;
class MockStorage {
    constructor() {
        this._innerStore = [];
    }
    // tslint:disable-next-line:naming-convention
    getItem(key) {
        return this._innerStore[key];
    }
    // tslint:disable-next-line:naming-convention
    setItem(key, value) {
        this._innerStore[key] = value;
    }
}
const tokenStorageStoreParameters = {
    'InMemory with Expiration': [Authentication_1.TokenPersist.Expiration, undefined, undefined, undefined, Authentication_1.TokenStoreType.InMemory],
    'InMemory with Session': [Authentication_1.TokenPersist.Session, undefined, undefined, undefined, Authentication_1.TokenStoreType.InMemory],
    'Cookie with Expiration': [Authentication_1.TokenPersist.Expiration, { cookie: '' }, undefined, undefined, Authentication_1.TokenStoreType.ExpirationCookie],
    'Cookie with Session': [Authentication_1.TokenPersist.Session, { cookie: '' }, undefined, undefined, Authentication_1.TokenStoreType.SessionCookie],
    'Storage with Expiration': [Authentication_1.TokenPersist.Expiration, undefined, new MockStorage(), new MockStorage(), Authentication_1.TokenStoreType.LocalStorage],
    'Storage with Session': [Authentication_1.TokenPersist.Session, undefined, new MockStorage(), new MockStorage(), Authentication_1.TokenStoreType.SessionStorage],
};
exports.TokenStoreTests = describe('TokenStores', () => {
    for (const key in tokenStorageStoreParameters) {
        if (tokenStorageStoreParameters.hasOwnProperty(key)) {
            const siteName = 'https://localhost';
            const tokenTemplate = '${siteName}-${tokenName}';
            const element = tokenStorageStoreParameters[key];
            const testToken = Authentication_1.Token.FromHeadAndPayload('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZW5zZW5ldCIsInN1YiI6ImF1dGgiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE0OTMzODM3NTQsImlhdCI6MTQ5MzM4MzY5NCwibmJmIjoxNDkzMzgzNjk0LCJuYW1lIjoiQnVpbHRJblxcQWRtaW4ifQ');
            describe(`TokenStore - ${key}`, () => {
                const tokenStore = new Authentication_1.TokenStore(siteName, tokenTemplate, element[0], element[1], element[2], element[3]);
                it('should construct the proper store', () => {
                    expect(Authentication_1.TokenStoreType[tokenStore.TokenStoreType]).to.be.eq(Authentication_1.TokenStoreType[element[4]]);
                });
                it('Should be constructed with with invalid tokens', () => {
                    expect(tokenStore.AccessToken.IsValid()).to.be.eq(false);
                    expect(tokenStore.RefreshToken.IsValid()).to.be.eq(false);
                });
                it('Should be able to set AccessToken', () => {
                    tokenStore.AccessToken = testToken;
                    expect(tokenStore.AccessToken.toString()).to.be.eq(testToken.toString());
                });
                it('Should be able to set RefreshToken', () => {
                    tokenStore.RefreshToken = testToken;
                    expect(tokenStore.RefreshToken.toString()).to.be.eq(testToken.toString());
                });
            });
        }
    }
});
//# sourceMappingURL=TokenStoreTests.js.map