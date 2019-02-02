"use strict";
/**
 * @module Authentication
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This enum represents how the token will be stored on the client-side.
 */
var TokenStoreType;
(function (TokenStoreType) {
    /**
     * The is stored in a cookie, without expiration date (Session Cookie).
     */
    TokenStoreType["SessionCookie"] = "SessionCookie";
    /**
     * The token is stored in a cookie, the expiration dates will match the token expiration dates
     */
    TokenStoreType["ExpirationCookie"] = "ExpirationCookie";
    /**
     * The token is stored in the local sessionStorage
     */
    TokenStoreType["SessionStorage"] = "SessionStorage";
    /**
     * The token is stored in the localStorage
     */
    TokenStoreType["LocalStorage"] = "LocalStorage";
    /**
     *  The token is stored in an in-memory storage (fallback)
     */
    TokenStoreType["InMemory"] = "InMemory";
})(TokenStoreType = exports.TokenStoreType || (exports.TokenStoreType = {}));
//# sourceMappingURL=TokenStoreType.js.map