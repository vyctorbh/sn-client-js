"use strict";
/**
 * @module Authentication
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This enum represents the current state of the user session
 */
var LoginState;
(function (LoginState) {
    /**
     * There is a request (login or token refresh) in progress
     */
    LoginState["Pending"] = "Pending";
    /**
     * The user is not authenticated
     */
    LoginState["Unauthenticated"] = "Unauthenticated";
    /**
     * The user is authenticated and has a valid access token
     */
    LoginState["Authenticated"] = "Authenticated";
})(LoginState = exports.LoginState || (exports.LoginState = {}));
//# sourceMappingURL=LoginState.js.map