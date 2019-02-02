/**
 * @module Mocks
 */ /** */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { IAuthenticationService, IOauthProvider, LoginResponse, LoginState } from '../../src/Authentication';
export declare class MockAuthService implements IAuthenticationService {
    HandleAuthenticationResponse(response: LoginResponse, resp?: boolean): boolean;
    private _oauthProviders;
    SetOauthProvider<T extends IOauthProvider>(provider: T): void;
    GetOauthProvider<T extends IOauthProvider>(providerType: {
        new (...args: any[]): T;
    }): T;
    CurrentUser: string;
    StateSubject: BehaviorSubject<LoginState>;
    constructor();
    ValidUserName: string;
    ValidPassword: string;
    readonly State: Observable<LoginState>;
    readonly CurrentState: LoginState;
    CheckForUpdate(): Observable<boolean>;
    Login(username: string, password: string): Observable<boolean>;
    Logout(): Observable<boolean>;
}
