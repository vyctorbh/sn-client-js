"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
const Observable_1 = require("rxjs/Observable");
const Authentication_1 = require("../src/Authentication");
const MockRepository_1 = require("./Mocks/MockRepository");
const MockTokenFactory_1 = require("./Mocks/MockTokenFactory");
// tslint:disable:no-string-literal
const expect = Chai.expect;
class MockOauthProvider {
    GetToken() {
        throw new Error('Method not implemented.');
    }
    Login(token) {
        throw new Error('Method not implemented.');
    }
}
exports.MockOauthProvider = MockOauthProvider;
let JwtServiceTests = class JwtServiceTests {
    // tslint:disable-next-line:naming-convention
    before() {
        this._repo = new MockRepository_1.MockRepository();
        this._jwtService = new Authentication_1.JwtService(this._repo);
    }
    'Construct with session persistance'() {
        const store = this._jwtService['_tokenStore'];
        expect(store['_tokenPersist']).to.be.eq(Authentication_1.TokenPersist.Session);
    }
    'State change should update global header on HttpProvider to access token head & payload'() {
        const headers = this._repo.HttpProviderRef.ActualHeaders;
        const validToken = MockTokenFactory_1.MockTokenFactory.CreateValid();
        expect(headers.get('X-Access-Data')).to.be.eq(undefined);
        this._jwtService['_tokenStore'].AccessToken = validToken; // Token.FromHeadAndPayload('a.b');
        this._jwtService['_stateSubject'].next(Authentication_1.LoginState.Authenticated);
        expect(headers.get('X-Access-Data')).to.be.eq(validToken.toString());
    }
    'Construct with expiration persistance'() {
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        expect(store['_tokenPersist']).to.be.eq(Authentication_1.TokenPersist.Expiration);
    }
    'checkForUpdate should return an observable'() {
        const obs = this._jwtService.CheckForUpdate();
        expect(obs).to.be.instanceof(Observable_1.Observable);
    }
    'LoginResponse with invalid token sould be emit False'(done) {
        this._repo.HttpProviderRef.AddResponse({
            access: 'invalidEncodedValue',
            refresh: 'invalidEncodedValue'
        });
        const obs = this._jwtService.Login('usr', 'pass');
        obs.subscribe((t) => {
            expect(t).to.be.eq(false);
            expect(this._jwtService.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
            done();
        }, (err) => {
            done(err);
        });
    }
    'Error response from Http endpoint response sould be emit False'(done) {
        this._repo.HttpProviderRef.AddError('Error happened :(');
        const obs = this._jwtService.Login('usr', 'pass');
        obs.subscribe((t) => {
            expect(t).to.be.eq(false);
            expect(this._jwtService.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
            done();
        }, (err) => {
            done(err);
        });
    }
    'CheckForUpdate should resolve with false and state should be Authenticated, if the access token is valid'(done) {
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateValid());
        t.CheckForUpdate().first().subscribe((result) => {
            expect(result).to.be.eq(false);
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Authenticated);
            done();
        });
    }
    'CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token has been expired'(done) {
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateExpired());
        store.SetToken('refresh', MockTokenFactory_1.MockTokenFactory.CreateExpired());
        t.CheckForUpdate().first().subscribe((result) => {
            expect(result).to.be.eq(false);
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
            done();
        });
    }
    'CheckForUpdate should resolve with true and state should be Authenticated, if refresh token is valid, but the access token has been expired and the request was valid'(done) {
        const refreshToken = MockTokenFactory_1.MockTokenFactory.CreateValid();
        this._repo.Config.JwtTokenPersist = 'expiration';
        this._repo.HttpProviderRef.AddResponse({
            access: MockTokenFactory_1.MockTokenFactory.CreateValid().toString(),
            refresh: refreshToken.toString()
        });
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateExpired());
        store.SetToken('refresh', refreshToken);
        t.CheckForUpdate().first().subscribe((result) => {
            expect(result).to.be.eq(true);
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Authenticated);
            done();
        });
    }
    'CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token is valid, but the access token has been expired and the request has failed'(done) {
        const refreshToken = MockTokenFactory_1.MockTokenFactory.CreateValid();
        this._repo.Config.JwtTokenPersist = 'expiration';
        this._repo.HttpProviderRef.AddError(new Error('There was some error during the token refresh request.'));
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateExpired());
        store.SetToken('refresh', refreshToken);
        t.CheckForUpdate().first().subscribe((result) => {
            done('This request should be failed, but it succeeded.');
        }, (err) => {
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
            done();
        });
    }
    'Login should resolve with true and set state to Authenticated, when request succeeded. '(done) {
        const refreshToken = MockTokenFactory_1.MockTokenFactory.CreateValid();
        this._repo.HttpProviderRef.AddResponse({
            access: MockTokenFactory_1.MockTokenFactory.CreateValid().toString(),
            refresh: refreshToken.toString()
        });
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        t.Login('user', 'pass').first().subscribe((result) => {
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Authenticated);
            done();
        }, (err) => {
            done(err);
        });
    }
    'Login should resolve with false and set state to Unauthenticated, when request failed. '(done) {
        this._repo.HttpProviderRef.AddError(new Error('There was some error during the token refresh request.'));
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        t.Login('user', 'pass').first().subscribe((result) => {
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
            done();
        }, (err) => {
            done(err);
        });
    }
    'Logout should invalidate both Access and Refresh tokens'(done) {
        this._repo.HttpProviderRef.AddResponse({ success: true });
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateValid());
        store.SetToken('refresh', MockTokenFactory_1.MockTokenFactory.CreateValid());
        t.CheckForUpdate().subscribe((result) => {
            expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Authenticated);
            t.Logout().subscribe((newState) => {
                expect(t.CurrentState).to.be.eq(Authentication_1.LoginState.Unauthenticated);
                done();
            });
        });
    }
    'CurrentUser should return BuiltIn\\Visitor by default'() {
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        expect(t.CurrentUser).to.be.eq('BuiltIn\\Visitor');
    }
    'CurrentUser should return user from payload when access token is set and valid'() {
        this._repo.Config.JwtTokenPersist = 'expiration';
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('access', MockTokenFactory_1.MockTokenFactory.CreateValid());
        expect(t.CurrentUser).to.be.eq('BuiltIn\\Mock');
    }
    'CurrentUser should return user from payload when refresh token is set and valid'() {
        const t = new Authentication_1.JwtService(this._repo);
        const store = t['_tokenStore'];
        store.SetToken('refresh', MockTokenFactory_1.MockTokenFactory.CreateValid());
        expect(t.CurrentUser).to.be.eq('BuiltIn\\Mock');
    }
    'SetOauthProvider should add an Oauth provider'() {
        const t = new Authentication_1.JwtService(this._repo);
        const provider = new MockOauthProvider();
        t.SetOauthProvider(provider);
        expect(t.GetOauthProvider(MockOauthProvider)).to.be.eq(provider);
    }
    'SetOauthProvider should throw an error when for duplicated providers'() {
        const t = new Authentication_1.JwtService(this._repo);
        const provider = new MockOauthProvider();
        const provider2 = new MockOauthProvider();
        t.SetOauthProvider(provider);
        expect(() => { t.SetOauthProvider(provider2); }).to.throw();
    }
    'GetOauthProvider should throw an error if there is no Oauth provider registered'() {
        const t = new Authentication_1.JwtService(this._repo);
        expect(() => { t.GetOauthProvider(MockOauthProvider); }).to.throw();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Construct with session persistance", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "State change should update global header on HttpProvider to access token head & payload", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Construct with expiration persistance", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "checkForUpdate should return an observable", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "LoginResponse with invalid token sould be emit False", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Error response from Http endpoint response sould be emit False", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CheckForUpdate should resolve with false and state should be Authenticated, if the access token is valid", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token has been expired", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CheckForUpdate should resolve with true and state should be Authenticated, if refresh token is valid, but the access token has been expired and the request was valid", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CheckForUpdate should resolve with false and state should be Unauthenticated, if refresh token is valid, but the access token has been expired and the request has failed", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Login should resolve with true and set state to Authenticated, when request succeeded. ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Login should resolve with false and set state to Unauthenticated, when request failed. ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "Logout should invalidate both Access and Refresh tokens", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CurrentUser should return BuiltIn\\Visitor by default", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CurrentUser should return user from payload when access token is set and valid", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "CurrentUser should return user from payload when refresh token is set and valid", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "SetOauthProvider should add an Oauth provider", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "SetOauthProvider should throw an error when for duplicated providers", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JwtServiceTests.prototype, "GetOauthProvider should throw an error if there is no Oauth provider registered", null);
JwtServiceTests = __decorate([
    mocha_typescript_1.suite('JwtService')
], JwtServiceTests);
exports.JwtServiceTests = JwtServiceTests;
//# sourceMappingURL=JwtServiceTests.js.map