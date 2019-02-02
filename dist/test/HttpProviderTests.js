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
const HttpProviders_1 = require("../src/HttpProviders");
const MockHttpProvider_1 = require("./Mocks/MockHttpProvider");
const expect = Chai.expect;
// tslint:disable:naming-convention
let HttpProviderTests = class HttpProviderTests {
    // tslint:disable:naming-convention
    constructor() {
        this._testHeaderName = 'testHeader';
        this._testHeaderValue = 'testHeaderValue';
    }
    SetGlobalHeaders() {
        const p = new MockHttpProvider_1.MockHttpProvider();
        p.SetGlobalHeader(this._testHeaderName, this._testHeaderValue);
        Chai.expect(p.ActualHeaders.get(this._testHeaderName)).to.be.eq(this._testHeaderValue);
    }
    UnsetGlobalHeaders() {
        const p = new MockHttpProvider_1.MockHttpProvider();
        p.SetGlobalHeader(this._testHeaderName, this._testHeaderValue);
        Chai.expect(p.ActualHeaders.get(this._testHeaderName)).to.be.eq(this._testHeaderValue);
        p.UnsetGlobalHeader(this._testHeaderName);
        Chai.expect(p.ActualHeaders.get(this._testHeaderName)).to.be.eq(undefined);
    }
    'globalHeaders should override options.headers'() {
        const p = new MockHttpProvider_1.MockHttpProvider();
        p.UseTimeout = false;
        p.SetGlobalHeader(this._testHeaderName, this._testHeaderValue);
        const options = {
            headers: {}
        };
        p.AddResponse({});
        options.headers[this._testHeaderName] = 'modifiedValue';
        p.Ajax(Object, options).share();
        expect(p.RequestLog[0].Options.headers[this._testHeaderName]).to.be.eq(this._testHeaderValue);
    }
    'globalHeaders should be overridden by additional headers'() {
        const p = new MockHttpProvider_1.MockHttpProvider();
        p.SetGlobalHeader(this._testHeaderName, this._testHeaderValue);
        p.AddResponse({});
        p.UseTimeout = false;
        p.Ajax(Object, {}, [{ name: this._testHeaderName, value: 'modifiedValue' }]).toPromise();
        expect(p.RequestLog[0].Options.headers[this._testHeaderName]).to.be.eq('modifiedValue');
    }
    'RxHttpProvider Ajax should make an XmlHttpRequest call'(done) {
        const p = new HttpProviders_1.RxAjaxHttpProvider();
        global.XMLHttpRequest = class {
            open() { }
            send() {
                this.readyState = 1;
                // Shouldn't resolve for now
                this.onreadystatechange();
                this.readyState = 4;
                this.status = 200;
                this.response = {};
                this.onreadystatechange();
            }
            setRequestHeader() { }
        };
        p.Ajax(Object, {}).subscribe((result) => {
            done();
        }, (err) => done(err));
    }
    'RxHttpProvider Upload should make an XmlHttpRequest call and parses response if possible'(done) {
        global.XMLHttpRequest = class {
            open() { }
            send() {
                setTimeout(() => {
                    this.readyState = 1;
                    this.onreadystatechange(); // Should be skipped
                    this.readyState = 4;
                    this.status = 200;
                    this.response = '{"success": "true"}';
                    this.onreadystatechange();
                }, 10);
            }
            setRequestHeader() { }
        };
        global.FormData = class {
            append() { }
        };
        const p = new HttpProviders_1.RxAjaxHttpProvider();
        const file = new File(['alma'], 'alma.txt');
        p.Upload(Object, file, {
            url: '',
            body: {
                data: 1
            },
            headers: {
                'X-Alma': 1
            }
        }).subscribe((result) => {
            expect(result.success).to.be.eq('true');
            done();
        }, (err) => done(err));
    }
    'RxHttpProvider Upload should make an XmlHttpRequest call and returns raw response if failed to parse'(done) {
        global.XMLHttpRequest = class {
            open() { }
            send() {
                setTimeout(() => {
                    this.readyState = 4;
                    this.status = 200;
                    this.response = 'a*b*c';
                    this.onreadystatechange();
                }, 10);
            }
            setRequestHeader() { }
        };
        global.FormData = class {
            append() { }
        };
        const p = new HttpProviders_1.RxAjaxHttpProvider();
        const file = new File(['alma'], 'alma.txt');
        p.Upload(Object, file, {
            url: '',
            body: {
                data: 1
            },
            headers: {
                'X-Alma': 1
            }
        }).subscribe((result) => {
            expect(result).to.be.eq('a*b*c');
            done();
        }, (err) => done(err));
    }
    'RxHttpProvider Upload should distribute an Error if the request has an invalid status'(done) {
        global.XMLHttpRequest = class {
            open() { }
            send() {
                setTimeout(() => {
                    this.readyState = 4;
                    this.status = 404;
                    this.response = 'a*b*c';
                    this.onreadystatechange();
                }, 10);
            }
            setRequestHeader() { }
        };
        global.FormData = class {
            append() { }
        };
        const p = new HttpProviders_1.RxAjaxHttpProvider();
        const file = new File(['alma'], 'alma.txt');
        p.Upload(Object, file, {
            url: '',
            body: {
                data: 1
            },
            headers: {
                'X-Alma': 1
            }
        }).subscribe((result) => {
            done('This request should be failed');
        }, (err) => done());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "SetGlobalHeaders", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "UnsetGlobalHeaders", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "globalHeaders should override options.headers", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "globalHeaders should be overridden by additional headers", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "RxHttpProvider Ajax should make an XmlHttpRequest call", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "RxHttpProvider Upload should make an XmlHttpRequest call and parses response if possible", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "RxHttpProvider Upload should make an XmlHttpRequest call and returns raw response if failed to parse", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], HttpProviderTests.prototype, "RxHttpProvider Upload should distribute an Error if the request has an invalid status", null);
HttpProviderTests = __decorate([
    mocha_typescript_1.suite('BaseHttpProvider')
], HttpProviderTests);
exports.HttpProviderTests = HttpProviderTests;
//# sourceMappingURL=HttpProviderTests.js.map