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
const Token_1 = require("../src/Authentication/Token");
const expect = Chai.expect;
let TokenTests = class TokenTests {
    constructor() {
        this._head = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9';
        this._payload = 'eyJpc3MiOiJzZW5zZW5ldCIsInN1YiI6ImF1dGgiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE0OTMyODQ1NDYsImlhdCI6MTQ5MzI4NDQ4NiwibmJmIjoxNDkzMjg0NDg2LCJuYW1lIjoiQnVpbHRJblxcQWRtaW4ifQ';
    }
    createTestToken() {
        return Token_1.Token.FromHeadAndPayload(`${this._head}.${this._payload}`);
    }
    'Construct token from encoded head and payload has valid serialized values'() {
        const t = this.createTestToken();
        expect(t.Username).to.be.eq('BuiltIn\\Admin');
        expect(t.GetPayload().name).to.be.eq('BuiltIn\\Admin');
        expect(t.IssuedDate.toUTCString()).to.be.eq('Thu, 27 Apr 2017 09:14:46 GMT');
        expect(t.NotBefore.toUTCString()).to.be.eq('Thu, 27 Apr 2017 09:14:46 GMT');
    }
    'Create empty token'() {
        const t = Token_1.Token.CreateEmpty();
        expect(t.Username).to.be.eq('');
        expect(t.IsValid()).to.be.eq(false);
    }
    'toString should return the original head and payload'() {
        const t = this.createTestToken();
        expect(t.toString()).to.be.eq(`${this._head}.${this._payload}`);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TokenTests.prototype, "Construct token from encoded head and payload has valid serialized values", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TokenTests.prototype, "Create empty token", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TokenTests.prototype, "toString should return the original head and payload", null);
TokenTests = __decorate([
    mocha_typescript_1.suite('Tokens')
], TokenTests);
exports.TokenTests = TokenTests;
//# sourceMappingURL=TokenTests.js.map