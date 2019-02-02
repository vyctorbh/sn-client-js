"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Authentication
 */ /** */
const _1 = require("./");
/**
 * This class is intended to store token data in LocalStorage or in-memory storage.
 */
class TokenStore {
    /**
     * @param {strnig} baseUrl The Base URL to the related site
     * @param {string} keyTemplate The template to use when generating keys in the local/session storage or for a cookie. ${siteName} and ${tokenName} will be replaced. Example: 'sn-${siteName}-${tokenName}'
     * @param {TokenPersist} tokenPersist Setting that indicates if the token should be persisted per session (browser close) or per Token expiration (based on the token `exp` property)
     * @param {Partial<Document>} documentRef The Document reference (used by unit tests)
     * @param {Storage} localStorageRef The localStorage reference (used by unit tests)
     * @param {Storage} sessionStorageRef The sessionStorage reference (used by unit tests)
     */
    constructor(_baseUrl, _keyTemplate, _tokenPersist, _documentRef = (typeof document === 'object') ? document : undefined, _localStorageRef = (typeof localStorage === 'object') ? localStorage : undefined, _sessionStorageRef = (typeof sessionStorage === 'object') ? sessionStorage : undefined) {
        this._baseUrl = _baseUrl;
        this._keyTemplate = _keyTemplate;
        this._tokenPersist = _tokenPersist;
        this._documentRef = _documentRef;
        this._localStorageRef = _localStorageRef;
        this._sessionStorageRef = _sessionStorageRef;
        /**
         * If localStorage is not available, stores the token data in this in-memory array
         */
        this._innerStore = new Map();
        const storesAvailable = (typeof this._localStorageRef !== 'undefined' && typeof this._sessionStorageRef !== 'undefined');
        const cookieAvailable = (typeof this._documentRef !== 'undefined' && typeof this._documentRef.cookie !== 'undefined');
        if (!storesAvailable && !cookieAvailable) {
            this.TokenStoreType = _1.TokenStoreType.InMemory;
        }
        else if (this._tokenPersist === _1.TokenPersist.Expiration) {
            storesAvailable ? this.TokenStoreType = _1.TokenStoreType.LocalStorage : this.TokenStoreType = _1.TokenStoreType.ExpirationCookie;
        }
        else {
            storesAvailable ? this.TokenStoreType = _1.TokenStoreType.SessionStorage : this.TokenStoreType = _1.TokenStoreType.SessionCookie;
        }
    }
    getStoreKey(key) {
        return this._keyTemplate.replace('${siteName}', this._baseUrl).replace('${tokenName}', key);
    }
    getTokenFromCookie(key, document) {
        const prefix = key + '=';
        if (document && document.cookie) {
            const cookieVal = document.cookie.split(';')
                .map((v) => v.trim())
                .find((v) => v.trim().indexOf(prefix) === 0);
            if (cookieVal) {
                return _1.Token.FromHeadAndPayload(cookieVal.substring(prefix.length));
            }
        }
        return _1.Token.CreateEmpty();
    }
    setTokenToCookie(key, token, persist, doc) {
        let cookie = `${key}=${token.toString()}`;
        if (persist === _1.TokenPersist.Expiration) {
            cookie += `; expires=${token.ExpirationTime.toUTCString()};`;
        }
        doc.cookie = cookie;
    }
    /**
     * Gets the specified token
     * @param key {TokenType} The key for the token
     * @returns {Token} The requested token, or Token.Empty in case of error
     */
    GetToken(key) {
        const storeKey = this.getStoreKey(key);
        try {
            switch (this.TokenStoreType) {
                case _1.TokenStoreType.InMemory:
                    return this._innerStore.has(storeKey) ? _1.Token.FromHeadAndPayload(this._innerStore.get(storeKey)) : _1.Token.CreateEmpty();
                case _1.TokenStoreType.LocalStorage:
                    return _1.Token.FromHeadAndPayload(this._localStorageRef.getItem(storeKey));
                case _1.TokenStoreType.SessionStorage:
                    return _1.Token.FromHeadAndPayload(this._sessionStorageRef.getItem(storeKey));
                case _1.TokenStoreType.ExpirationCookie:
                case _1.TokenStoreType.SessionCookie:
                    return this.getTokenFromCookie(storeKey, this._documentRef);
            }
        }
        catch (err) {
            //
        }
        return _1.Token.CreateEmpty();
    }
    /**
     * Sets the token with the specified key to the specified value
     * @param key {TokenType} The key for the token to set
     * @param token {Token} The token to set with the specified key
     */
    SetToken(key, token) {
        const storeKey = this.getStoreKey(key);
        const dtaString = token.toString();
        switch (this.TokenStoreType) {
            case _1.TokenStoreType.InMemory:
                this._innerStore.set(storeKey, dtaString);
                break;
            case _1.TokenStoreType.LocalStorage:
                this._localStorageRef.setItem(storeKey, dtaString);
                break;
            case _1.TokenStoreType.SessionStorage:
                this._sessionStorageRef.setItem(storeKey, dtaString);
                break;
            case _1.TokenStoreType.ExpirationCookie:
                this.setTokenToCookie(storeKey, token, _1.TokenPersist.Expiration, this._documentRef);
                break;
            case _1.TokenStoreType.SessionCookie:
                this.setTokenToCookie(storeKey, token, _1.TokenPersist.Session, this._documentRef);
                break;
        }
    }
    /**
     * The current Access Token
     */
    get AccessToken() {
        return this.GetToken('access');
    }
    set AccessToken(value) {
        this.SetToken('access', value);
    }
    /**
     * The current Refresh Token
     */
    get RefreshToken() {
        return this.GetToken('refresh');
    }
    set RefreshToken(value) {
        this.SetToken('refresh', value);
    }
}
exports.TokenStore = TokenStore;
//# sourceMappingURL=TokenStore.js.map