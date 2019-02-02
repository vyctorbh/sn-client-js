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
const BinaryField_1 = require("../src/BinaryField");
const ContentTypes_1 = require("../src/ContentTypes");
const Mocks_1 = require("./Mocks");
const expect = Chai.expect;
let BinaryFieldTests = class BinaryFieldTests {
    // tslint:disable-next-line:naming-convention
    before() {
        this._repo = new Mocks_1.MockRepository();
        this._file = this._repo.HandleLoadedContent({
            Id: 123,
            Path: 'Root/Examples/ExampleFile',
            Name: 'test',
            Type: 'File',
            Binary: {
                __mediaresource: {
                    media_src: 'https://google.com'
                }
            }
        }, ContentTypes_1.File);
    }
    createField() {
        return this._file.Binary;
    }
    'Can be constructed'() {
        const field = this.createField();
        expect(field).to.be.instanceof(BinaryField_1.BinaryField);
    }
    'MediaResourceObject should be available'() {
        const field = this.createField();
        expect(field.GetMediaResourceObject()).to.be.instanceof(Object);
        expect(field.GetMediaResourceObject().__mediaresource).to.be.instanceof(Object);
        expect(field.GetMediaResourceObject().__mediaresource.media_src).to.be.eq('https://google.com');
    }
    'DownloadUrl should be available'() {
        const field = this.createField();
        expect(field.GetDownloadUrl()).to.be.eq('https://google.com');
    }
    'DownloadUrl should be available without MediaResourceObject'() {
        const field = new BinaryField_1.BinaryField(null, this._file, { Name: 'Binary' });
        expect(field.GetDownloadUrl()).to.be.eq('/binaryhandler.ashx?nodeid=123&propertyname=Binary');
    }
    'Parent.GetFullPath() should return the ParentContentPath'(done) {
        this._file.GetRepository = () => {
            return {
                UploadFile: (options) => {
                    expect(options.Parent.GetFullPath()).to.be.eq(this._file.ParentContentPath);
                    expect(options).to.be.instanceof(Object);
                    done();
                }
            };
        };
        const field = this.createField();
        field.SaveBinaryFile(new File(['alma'], 'alma.txt'));
    }
    'SaveBinaryFile() should trigger an upload request'(done) {
        this._file.GetRepository = () => {
            return {
                UploadFile: (options) => {
                    expect(options.Overwrite).to.be.eq(true);
                    expect(options.File.name).to.be.eq(this._file.Name);
                    expect(options).to.be.instanceof(Object);
                    done();
                }
            };
        };
        const field = this.createField();
        field.SaveBinaryFile(new File(['alma'], 'alma.txt'));
    }
    'SaveBinaryText() should trigger an upload request'(done) {
        this._file.GetRepository = () => {
            return {
                UploadFile: (options) => {
                    expect(options).to.be.instanceof(Object);
                    done();
                }
            };
        };
        const field = this.createField();
        field.SaveBinaryText('alma');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "Can be constructed", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "MediaResourceObject should be available", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "DownloadUrl should be available", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "DownloadUrl should be available without MediaResourceObject", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "Parent.GetFullPath() should return the ParentContentPath", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "SaveBinaryFile() should trigger an upload request", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], BinaryFieldTests.prototype, "SaveBinaryText() should trigger an upload request", null);
BinaryFieldTests = __decorate([
    mocha_typescript_1.suite('BinaryField')
], BinaryFieldTests);
exports.BinaryFieldTests = BinaryFieldTests;
//# sourceMappingURL=BinaryFieldTests.js.map