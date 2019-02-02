/**
 * @module Authentication
 */ /** */
import { Token, TokenPersist, TokenStoreType } from './';
/**
 * Indicates the type of the token
 */
export declare type TokenType = 'access' | 'refresh';
/**
 * This class is intended to store token data in LocalStorage or in-memory storage.
 */
export declare class TokenStore {
    private readonly _baseUrl;
    private readonly _keyTemplate;
    private readonly _tokenPersist;
    private _documentRef;
    private _localStorageRef;
    private _sessionStorageRef;
    /**
     * @param {strnig} baseUrl The Base URL to the related site
     * @param {string} keyTemplate The template to use when generating keys in the local/session storage or for a cookie. ${siteName} and ${tokenName} will be replaced. Example: 'sn-${siteName}-${tokenName}'
     * @param {TokenPersist} tokenPersist Setting that indicates if the token should be persisted per session (browser close) or per Token expiration (based on the token `exp` property)
     * @param {Partial<Document>} documentRef The Document reference (used by unit tests)
     * @param {Storage} localStorageRef The localStorage reference (used by unit tests)
     * @param {Storage} sessionStorageRef The sessionStorage reference (used by unit tests)
     */
    constructor(_baseUrl: string, _keyTemplate: string, _tokenPersist: TokenPersist, _documentRef?: Document | undefined, _localStorageRef?: Storage | undefined, _sessionStorageRef?: Storage | undefined);
    /**
     * If localStorage is not available, stores the token data in this in-memory array
     */
    private _innerStore;
    /**
     * The type of the generated Token Store
     */
    readonly TokenStoreType: TokenStoreType;
    private getStoreKey(key);
    private getTokenFromCookie(key, document);
    private setTokenToCookie(key, token, persist, doc);
    /**
     * Gets the specified token
     * @param key {TokenType} The key for the token
     * @returns {Token} The requested token, or Token.Empty in case of error
     */
    GetToken(key: TokenType): Token;
    /**
     * Sets the token with the specified key to the specified value
     * @param key {TokenType} The key for the token to set
     * @param token {Token} The token to set with the specified key
     */
    SetToken(key: TokenType, token: Token): void;
    /**
     * The current Access Token
     */
    AccessToken: Token;
    /**
     * The current Refresh Token
     */
    RefreshToken: Token;
}
