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
const ContentTypes_1 = require("../src/ContentTypes");
const MockRepository_1 = require("./Mocks/MockRepository");
const expect = Chai.expect;
let ContentSerializerTests = class ContentSerializerTests {
    constructor() {
        this._contentSerializedString = '{"Data":{"Id":3,"Name":"test","Path":"root/task1"},"Origin":"https://mock_repo_one/odata.svc/root/task1"}';
    }
    // tslint:disable-next-line:naming-convention
    before() {
        this._repo = new MockRepository_1.MockRepository({
            RepositoryUrl: 'https://mock_repo_one'
        });
        this._repo2 = new MockRepository_1.MockRepository({
            RepositoryUrl: 'https://mock_repo_two'
        });
        this._content = this._repo.HandleLoadedContent({
            Id: 3,
            Path: 'root/task1',
            Type: 'Task',
            Name: 'test'
        }, ContentTypes_1.Task);
    }
    'content.Stringify() should create a valid output'() {
        const serialized = this._content.Stringify();
        expect(serialized).to.be.eq(this._contentSerializedString);
    }
    'content.Stringify() should throw an error when no Path specified'() {
        this._content.Path = '';
        expect(() => this._content.Stringify()).to.throw();
    }
    'Repository.Parse should return a Content instance'() {
        const parsed = this._repo.ParseContent(this._contentSerializedString);
        expect(parsed).to.be.eq(this._content);
    }
    'Repository.Parse should throw an Error when trying parse a Content from a different Repository origin'() {
        expect(() => { this._repo2.ParseContent(this._contentSerializedString); }).to.throw();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentSerializerTests.prototype, "content.Stringify() should create a valid output", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentSerializerTests.prototype, "content.Stringify() should throw an error when no Path specified", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentSerializerTests.prototype, "Repository.Parse should return a Content instance", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentSerializerTests.prototype, "Repository.Parse should throw an Error when trying parse a Content from a different Repository origin", null);
ContentSerializerTests = __decorate([
    mocha_typescript_1.suite('ContentSerializer')
], ContentSerializerTests);
exports.ContentSerializerTests = ContentSerializerTests;
//# sourceMappingURL=ContentSerializerTests.js.map