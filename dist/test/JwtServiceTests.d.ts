/// <reference types="mocha" />
import { IOauthProvider } from '../src/Authentication';
export declare class MockOauthProvider implements IOauthProvider {
    GetToken(): Promise<string>;
    Login(token: string): Promise<any>;
}
export declare class JwtServiceTests {
    private _repo;
    private _jwtService;
    before(): void;
    'Construct with session persistance'(): void;
    'State change should update global header on HttpProvider to access token head & payload'(): void;
    'Construct with expiration persistance'(): void;
    'checkForUpdate should return an observable'(): void;
    'LoginResponse with invalid token sould be emit False'(done: MochaDone): void;
    'Error response from Http endpoint response sould be emit False'(done: MochaDone): void;
    'CheckForUpdate should resolve with false and state should be Authenticated, if the access token is valid'(done: MochaDone): void;
    'CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token has been expired'(done: MochaDone): void;
    'CheckForUpdate should resolve with true and state should be Authenticated, if refresh token is valid, but the access token has been expired and the request was valid'(done: MochaDone): void;
    'CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token is valid, but the access token has been expired and the request has failed'(done: MochaDone): void;
    'Login should resolve with true and set state to Authenticated, when request succeeded. '(done: MochaDone): void;
    'Login should resolve with false and set state to Unauthenticated, when request failed. '(done: MochaDone): void;
    'Logout should invalidate both Access and Refresh tokens'(done: MochaDone): void;
    'CurrentUser should return BuiltIn\\Visitor by default'(): void;
    'CurrentUser should return user from payload when access token is set and valid'(): void;
    'CurrentUser should return user from payload when refresh token is set and valid'(): void;
    'SetOauthProvider should add an Oauth provider'(): void;
    'SetOauthProvider should throw an error when for duplicated providers'(): void;
    'GetOauthProvider should throw an error if there is no Oauth provider registered'(): void;
}
