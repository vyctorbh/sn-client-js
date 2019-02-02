/**
 * @module Mocks
 */ /** */
import { Token } from '../../src/Authentication';
export declare class MockTokenFactory {
    private static getStillValidDate();
    private static createWithDates(expiration, notBefore);
    static CreateValid(): Token;
    static CreateExpired(): Token;
    static CreateNotValidYet(): Token;
}
