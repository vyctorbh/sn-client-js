"use strict";
/**
 * @module Mocks
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const Authentication_1 = require("../../src/Authentication");
class MockTokenFactory {
    static getStillValidDate() {
        const date = new Date();
        date.setTime(date.getTime() + 3000000);
        return date.getTime() / 1000;
    }
    static createWithDates(expiration, notBefore) {
        const header = {};
        const payload = {
            aud: '',
            exp: expiration,
            iat: 0,
            iss: '',
            name: 'BuiltIn\\Mock',
            nbf: notBefore,
            sub: ''
        };
        const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64');
        const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64');
        return Authentication_1.Token.FromHeadAndPayload(`${headerEncoded}.${payloadEncoded}`);
    }
    static CreateValid() {
        return this.createWithDates(this.getStillValidDate(), 1);
    }
    static CreateExpired() {
        return this.createWithDates(1, this.getStillValidDate());
    }
    static CreateNotValidYet() {
        return this.createWithDates(this.getStillValidDate(), this.getStillValidDate());
    }
}
exports.MockTokenFactory = MockTokenFactory;
//# sourceMappingURL=MockTokenFactory.js.map