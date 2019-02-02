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
const LoginState_1 = require("../src/Authentication/LoginState");
const Content_1 = require("../src/Content");
const ContentReferences_1 = require("../src/ContentReferences");
const ContentTypes_1 = require("../src/ContentTypes");
const MockRepository_1 = require("./Mocks/MockRepository");
const expect = Chai.expect;
// tslint:disable:no-string-literal
let ContentListReferenceFieldTests = class ContentListReferenceFieldTests {
    // tslint:disable-next-line:naming-convention
    before() {
        this._repo = new MockRepository_1.MockRepository();
        this._ownerContent = this._repo.HandleLoadedContent({ Id: 123765, Path: 'Root/Tests', Name: 'TestOwnerContent' }, ContentTypes_1.Task);
        this._repo.Authentication.StateSubject.next(LoginState_1.LoginState.Authenticated);
        this._loadedRef = new ContentReferences_1.ContentListReferenceField([{
                Id: 1,
                Path: 'root/a/b',
                Name: 'Name',
                Type: 'Task',
                DueText: 'testDueText'
            }], {}, this._ownerContent, this._repo);
        this._unloadedRef = new ContentReferences_1.ContentListReferenceField({
            __deferred: {
                uri: 'a/b/c'
            }
        }, {}, this._ownerContent, this._repo);
    }
    'Should be able to construct ContentReferenceField from Deferred without loaded content reference'() {
        expect(this._unloadedRef).to.be.instanceof(ContentReferences_1.ContentListReferenceField);
        expect(this._unloadedRef['_contentReferences']).to.be.eq(undefined);
    }
    'Should be able to construct ContentReferenceField from IContentOptions with loaded content reference'() {
        expect(this._loadedRef).to.be.instanceof(ContentReferences_1.ContentListReferenceField);
        expect(this._loadedRef['_contentReferences'][0]).to.be.instanceOf(Content_1.ContentInternal);
        expect(this._loadedRef['_contentReferences'][0].DueText).to.be.eq('testDueText');
    }
    'Getting unloaded referenced Content should trigger an OData call'(done) {
        this._repo.HttpProviderRef.AddResponse({
            d: {
                results: [{
                        Id: 123,
                        DisplayName: 'aaa',
                        Name: 'bbb',
                        Path: 'Root/Workspace',
                        Type: 'Workspace'
                    }]
            }
        });
        this._unloadedRef.GetContent().subscribe((c) => {
            expect(this._unloadedRef['_contentReferences']).to.be.eq(c);
            done();
        }, (err) => done);
    }
    'Getting loaded referenced Content should NOT trigger an OData call'(done) {
        this._loadedRef.GetContent().subscribe((c) => {
            expect(this._loadedRef['_contentReferences']).to.be.eq(c);
            done();
        }, (err) => done);
    }
    'getValue should return undefined for unloaded reference'() {
        expect(this._unloadedRef.GetValue()).to.be.eq(undefined);
    }
    'getValue should return the loaded Path for a loaded reference'() {
        expect(this._loadedRef.GetValue()).to.be.deep.eq(this._loadedRef['_contentReferences'].map((p) => p.Path));
    }
    'SetContent should set the reference content'(done) {
        this._unloadedRef.SetContent(this._loadedRef['_contentReferences']);
        this._unloadedRef.GetContent().subscribe((c) => {
            expect(c).to.eq(this._loadedRef['_contentReferences']);
            done();
        }, (err) => done);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "Should be able to construct ContentReferenceField from Deferred without loaded content reference", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "Should be able to construct ContentReferenceField from IContentOptions with loaded content reference", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "Getting unloaded referenced Content should trigger an OData call", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "Getting loaded referenced Content should NOT trigger an OData call", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "getValue should return undefined for unloaded reference", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "getValue should return the loaded Path for a loaded reference", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ContentListReferenceFieldTests.prototype, "SetContent should set the reference content", null);
ContentListReferenceFieldTests = __decorate([
    mocha_typescript_1.suite('ContentListReferenceField')
], ContentListReferenceFieldTests);
exports.ContentListReferenceFieldTests = ContentListReferenceFieldTests;
//# sourceMappingURL=ContentListReferenceFieldTests.js.map