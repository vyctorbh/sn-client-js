/**
 * @module Authentication
 */ /** */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BaseRepository } from '../Repository/BaseRepository';
import { IAuthenticationService, IOauthProvider, LoginResponse, LoginState } from './';
/**
 * This service class manages the JWT authentication, the session and the current login state.
 */
export declare class JwtService implements IAuthenticationService {
    protected readonly _repository: BaseRepository;
    private readonly _visitorName;
    private _oauthProviders;
    /**
     * Sets a specified OAuth provider
     * @param {IOauthProvider} provider The provider instance to be set
     * @throws if a provider with the specified type has already been set
     */
    SetOauthProvider<T extends IOauthProvider>(provider: T): void;
    /**
     * Gets the specified OAuth provider instance
     * @param {<T>} providerType The provider type to be retrieved
     * @throws if the provider hasn't been registered
     */
    GetOauthProvider<T extends IOauthProvider>(providerType: {
        new (...args: any[]): T;
    }): T;
    /**
     * Returns the current user's name as a string. In case of unauthenticated users, it will return 'BuiltIn\Visitor'
     */
    readonly CurrentUser: string;
    /**
     * This observable indicates the current state of the service
     * @default LoginState.Pending
     */
    readonly State: Observable<LoginState>;
    /**
     * Gets the current state of the service
     * @default LoginState.Pending
     */
    readonly CurrentState: LoginState;
    /**
     * The private subject for tracking the login state
     */
    protected readonly _stateSubject: BehaviorSubject<LoginState>;
    /**
     * The store for JWT tokens
     */
    private _tokenStore;
    /**
     * Executed before each Ajax call. If the access token has been expired, but the refresh token is still valid, it triggers the token refreshing call
     * @returns {Observable<boolean>} An observable with a variable that indicates if there was a refresh triggered.
     */
    CheckForUpdate(): Observable<boolean>;
    /**
     * Executes the token refresh call. Refresh the token in the Token Store and in the Service, updates the HttpService header
     * @returns {Observable<boolean>} An observable that will be completed with true on a succesfull refresh
     */
    private execTokenRefresh();
    /**
     * @param {BaseRepository} _repository the Repository reference for the Authentication. The service will read its configuration and use its HttpProvider
     * @constructs JwtService
     */
    constructor(_repository: BaseRepository);
    HandleAuthenticationResponse(response: LoginResponse): boolean;
    /**
     * It is possible to send authentication requests using this action. You provide the username and password and will get the User object as the response if the login operation was
     * successful or HTTP 403 Forbidden message if it wasn’t. If the username does not contain a domain prefix, the configured default domain will be used. After you logged in the user successfully,
     * you will receive a standard ASP.NET auth cookie which will make sure that your subsequent requests will be authorized correctly.
     *
     * The username and password is sent in clear text, always send these kinds of requests through HTTPS.
     * @param username {string} Name of the user.
     * @param password {string} Password of the user.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let userLogin = service.Login('alba', 'alba');
     * userLogin.subscribe({
     *  next: response => {
     *      console.log('Login success', response);
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Login(username: string, password: string): Observable<boolean>;
    /**
     * Logs out the current user, sets the tokens to 'empty' and sends a Logout request to invalidate all Http only cookies
     * @returns {Observable<boolean>} An Observable that will be updated with the logout response
     */
    Logout(): Observable<boolean>;
}
