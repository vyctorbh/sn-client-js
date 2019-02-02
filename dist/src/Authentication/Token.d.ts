/**
 * @module Authentication
 */ /** */
import { ITokenPayload } from './';
/**
 * This class represents a sense NET JWT Token instance.
 */
export declare class Token {
    private readonly _headerEncoded;
    private readonly _payloadEncoded;
    private readonly _tokenPayload;
    private fromEpoch(epoch);
    /**
     * The Username from the current Token payload
     */
    readonly Username: string;
    /**
     * The current Token full Payload
     */
    GetPayload(): ITokenPayload;
    /**
     * The Date when the token will expire
     */
    readonly ExpirationTime: Date;
    /**
     * The token will be valid only after this date
     */
    readonly NotBefore: Date;
    /**
     * Indicates if the Token is valid based on it's ExpirationTime and NotBefore values.
     */
    IsValid(): boolean;
    /**
     * The date when the Token was issued
     */
    readonly IssuedDate: Date;
    /**
     * Returns the Token in string format (in a base64 encoded, dot separated header and payload)
     */
    toString(): string;
    /**
     * Factory method to create a token from a sense NET specific base64 encoded header and payload string, e.g.:
     * ```
     * const myToken = Token.FromHeadAndPayload("e30=.eyJhdWQiOiIiLCJleHAiOjE0OTQ1NzkwOTUuMTIsImlhdCI6MCwiaXNzIjoiIiwibmFtZSI6IiIsIm5iZiI6MSwic3ViIjoiIn0=");
     * ```
     * @constructs Token
     */
    static FromHeadAndPayload(headAndPayload: string): Token;
    /**
     * Factory method for creating empty (invalid) tokens
     * ```
     * const invalidToken = Token.CreateEmpty();
     * ```
     * @constructs Token
     */
    static CreateEmpty(): Token;
    private constructor();
}
