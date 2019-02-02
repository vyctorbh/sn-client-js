"use strict";
/**
 * @module Authentication
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
const SN_1 = require("../SN");
const _1 = require("./");
/**
 * This service class manages the JWT authentication, the session and the current login state.
 */
class JwtService {
    /**
     * @param {BaseRepository} _repository the Repository reference for the Authentication. The service will read its configuration and use its HttpProvider
     * @constructs JwtService
     */
    constructor(_repository) {
        this._repository = _repository;
        this._visitorName = 'BuiltIn\\Visitor';
        this._oauthProviders = new Map();
        /**
         * The private subject for tracking the login state
         */
        this._stateSubject = new BehaviorSubject_1.BehaviorSubject(_1.LoginState.Pending);
        /**
         * The store for JWT tokens
         */
        this._tokenStore = new _1.TokenStore(this._repository.Config.RepositoryUrl, this._repository.Config.JwtTokenKeyTemplate, (this._repository.Config.JwtTokenPersist === 'session') ? _1.TokenPersist.Session : _1.TokenPersist.Expiration);
        this._stateSubject = new BehaviorSubject_1.BehaviorSubject(_1.LoginState.Pending);
        this.State.subscribe((s) => {
            if (this._tokenStore.AccessToken.IsValid()) {
                this._repository.HttpProviderRef.SetGlobalHeader('X-Access-Data', this._tokenStore.AccessToken.toString());
            }
            else {
                this._repository.HttpProviderRef.UnsetGlobalHeader('X-Access-Data');
            }
        });
        this.CheckForUpdate();
    }
    /**
     * Sets a specified OAuth provider
     * @param {IOauthProvider} provider The provider instance to be set
     * @throws if a provider with the specified type has already been set
     */
    SetOauthProvider(provider) {
        const providerCtor = provider.constructor;
        if (this._oauthProviders.has(providerCtor)) {
            throw Error(`Provider for '${providerCtor.name}' already set`);
        }
        this._oauthProviders.set(providerCtor, provider);
    }
    /**
     * Gets the specified OAuth provider instance
     * @param {<T>} providerType The provider type to be retrieved
     * @throws if the provider hasn't been registered
     */
    GetOauthProvider(providerType) {
        if (!this._oauthProviders.has(providerType)) {
            throw Error(`OAuth provider not found for '${providerType.name}'`);
        }
        return this._oauthProviders.get(providerType);
    }
    /**
     * Returns the current user's name as a string. In case of unauthenticated users, it will return 'BuiltIn\Visitor'
     */
    get CurrentUser() {
        if (this._tokenStore.AccessToken.IsValid() || this._tokenStore.RefreshToken.IsValid()) {
            return this._tokenStore.AccessToken.Username || this._tokenStore.RefreshToken.Username;
        }
        return this._visitorName;
    }
    /**
     * This observable indicates the current state of the service
     * @default LoginState.Pending
     */
    get State() {
        return this._stateSubject.distinctUntilChanged();
    }
    /**
     * Gets the current state of the service
     * @default LoginState.Pending
     */
    get CurrentState() {
        return this._stateSubject.getValue();
    }
    /**
     * Executed before each Ajax call. If the access token has been expired, but the refresh token is still valid, it triggers the token refreshing call
     * @returns {Observable<boolean>} An observable with a variable that indicates if there was a refresh triggered.
     */
    CheckForUpdate() {
        if (this._tokenStore.AccessToken.IsValid()) {
            this._stateSubject.next(_1.LoginState.Authenticated);
            return Observable_1.Observable.from([false]);
        }
        if (!this._tokenStore.RefreshToken.IsValid()) {
            this._stateSubject.next(_1.LoginState.Unauthenticated);
            return Observable_1.Observable.from([false]);
        }
        this._stateSubject.next(_1.LoginState.Pending);
        return this.execTokenRefresh();
    }
    /**
     * Executes the token refresh call. Refresh the token in the Token Store and in the Service, updates the HttpService header
     * @returns {Observable<boolean>} An observable that will be completed with true on a succesfull refresh
     */
    execTokenRefresh() {
        const refresh = this._repository.HttpProviderRef.Ajax(_1.RefreshResponse, {
            method: 'POST',
            url: SN_1.ODataHelper.joinPaths(this._repository.Config.RepositoryUrl, 'sn-token/refresh'),
            headers: {
                'X-Refresh-Data': this._tokenStore.RefreshToken.toString(),
                'X-Authentication-Type': 'Token',
            },
        });
        refresh.subscribe((response) => {
            this._tokenStore.AccessToken = _1.Token.FromHeadAndPayload(response.access);
            this._stateSubject.next(_1.LoginState.Authenticated);
        }, (err) => {
            this._stateSubject.next(_1.LoginState.Unauthenticated);
        });
        return refresh.map((response) => true);
    }
    HandleAuthenticationResponse(response) {
        this._tokenStore.AccessToken = _1.Token.FromHeadAndPayload(response.access);
        this._tokenStore.RefreshToken = _1.Token.FromHeadAndPayload(response.refresh);
        if (this._tokenStore.AccessToken.IsValid()) {
            this._stateSubject.next(_1.LoginState.Authenticated);
            return true;
        }
        this._stateSubject.next(_1.LoginState.Unauthenticated);
        return false;
    }
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
    Login(username, password) {
        const sub = new Subject_1.Subject();
        this._stateSubject.next(_1.LoginState.Pending);
        const authToken = btoa(`${username}:${password}`);
        this._repository.HttpProviderRef.Ajax(_1.LoginResponse, {
            method: 'POST',
            url: SN_1.ODataHelper.joinPaths(this._repository.Config.RepositoryUrl, 'sn-token/login'),
            headers: {
                'X-Authentication-Type': 'Token',
                'Authorization': `Basic ${authToken}`,
            },
        })
            .subscribe((r) => {
            const result = this.HandleAuthenticationResponse(r);
            sub.next(result);
        }, (err) => {
            this._stateSubject.next(_1.LoginState.Unauthenticated);
            sub.next(false);
        });
        return sub.asObservable();
    }
    /**
     * Logs out the current user, sets the tokens to 'empty' and sends a Logout request to invalidate all Http only cookies
     * @returns {Observable<boolean>} An Observable that will be updated with the logout response
     */
    Logout() {
        this._tokenStore.AccessToken = _1.Token.CreateEmpty();
        this._tokenStore.RefreshToken = _1.Token.CreateEmpty();
        this._stateSubject.next(_1.LoginState.Unauthenticated);
        return this._repository.HttpProviderRef.Ajax(_1.LoginResponse, {
            method: 'POST',
            url: SN_1.ODataHelper.joinPaths(this._repository.Config.RepositoryUrl, 'sn-token/logout'),
        }).map(() => true);
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=JwtService.js.map