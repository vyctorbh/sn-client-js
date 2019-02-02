"use strict";
/**
 * @module Authentication
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This enum shows how the token should be persisted.
 */
var TokenPersist;
(function (TokenPersist) {
    /**
     * Token should be removed on session end (browser close)
     */
    TokenPersist[TokenPersist["Session"] = 0] = "Session";
    /**
     * Token should be removed when the token will be expired
     */
    TokenPersist[TokenPersist["Expiration"] = 1] = "Expiration";
})(TokenPersist = exports.TokenPersist || (exports.TokenPersist = {}));
//# sourceMappingURL=TokenPersist.js.map