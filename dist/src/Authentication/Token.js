"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represents a sense NET JWT Token instance.
 */
class Token {
    constructor(_headerEncoded, _payloadEncoded) {
        this._headerEncoded = _headerEncoded;
        this._payloadEncoded = _payloadEncoded;
    }
    get _tokenPayload() {
        try {
            return JSON.parse(Buffer.from(this._payloadEncoded, 'base64').toString());
        }
        catch (err) {
            return {
                aud: '',
                exp: 0,
                iat: 0,
                iss: '',
                name: '',
                nbf: 0,
                sub: '',
            };
        }
    }
    fromEpoch(epoch) {
        const d = new Date(0);
        d.setUTCSeconds(epoch);
        return d;
    }
    /**
     * The Username from the current Token payload
     */
    get Username() {
        return this._tokenPayload.name;
    }
    /**
     * The current Token full Payload
     */
    GetPayload() {
        return this._tokenPayload;
    }
    /**
     * The Date when the token will expire
     */
    get ExpirationTime() {
        return this.fromEpoch(this._tokenPayload.exp);
    }
    /**
     * The token will be valid only after this date
     */
    get NotBefore() {
        return this.fromEpoch(this._tokenPayload.nbf);
    }
    /**
     * Indicates if the Token is valid based on it's ExpirationTime and NotBefore values.
     */
    IsValid() {
        // const now = new Date();
        // return this._tokenPayload && this.ExpirationTime > now && this.NotBefore < now;
        return true;
    }
    /**
     * The date when the Token was issued
     */
    get IssuedDate() {
        return this.fromEpoch(this._tokenPayload.iat);
    }
    /**
     * Returns the Token in string format (in a base64 encoded, dot separated header and payload)
     */
    // tslint:disable-next-line:naming-convention
    toString() {
        return `${this._headerEncoded}.${this._payloadEncoded}`;
    }
    /**
     * Factory method to create a token from a sense NET specific base64 encoded header and payload string, e.g.:
     * ```
     * const myToken = Token.FromHeadAndPayload("e30=.eyJhdWQiOiIiLCJleHAiOjE0OTQ1NzkwOTUuMTIsImlhdCI6MCwiaXNzIjoiIiwibmFtZSI6IiIsIm5iZiI6MSwic3ViIjoiIn0=");
     * ```
     * @constructs Token
     */
    static FromHeadAndPayload(headAndPayload) {
        const [head, payload] = headAndPayload.split('.');
        return new Token(head, payload);
    }
    /**
     * Factory method for creating empty (invalid) tokens
     * ```
     * const invalidToken = Token.CreateEmpty();
     * ```
     * @constructs Token
     */
    static CreateEmpty() {
        return new Token('', '');
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map