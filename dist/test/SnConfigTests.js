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
const snconfigbehavior_1 = require("../src/Config/snconfigbehavior");
const snconfigfieldmodel_1 = require("../src/Config/snconfigfieldmodel");
const snconfigfieldmodelstore_1 = require("../src/Config/snconfigfieldmodelstore");
const snconfigmodel_1 = require("../src/Config/snconfigmodel");
const expect = Chai.expect;
let SnConfigTests = class SnConfigTests {
    'SnConfigFieldModel Should be constructed with SnConfigBehavior.Default'() {
        const fieldModel = new snconfigfieldmodel_1.SnConfigFieldModel();
        expect(fieldModel.Behavior).to.be.eq(snconfigbehavior_1.SnConfigBehavior.Default);
    }
    'SnConfigFieldModelStore return the Entity in the store '() {
        snconfigfieldmodelstore_1.SnConfigFieldModelStore.Add({ FieldName: 'AddedExample', Question: 'ExampleQuestion', Behavior: snconfigbehavior_1.SnConfigBehavior.Default, StoreKey: 'AddedExample' });
        const model = snconfigfieldmodelstore_1.SnConfigFieldModelStore.Get('AddedExample');
        expect(model.FieldName).to.be.eq('AddedExample');
        expect(model.Question).to.be.eq('ExampleQuestion');
    }
    'SnConfigFieldModelStore Should throw error if entity isn\'t in the store '() {
        const find = () => { snconfigfieldmodelstore_1.SnConfigFieldModelStore.Get('exampleFieldName'); };
        expect(find).to.throw(Error);
    }
    'SnConfigFieldModelStore Should throw an error if you try to add a field that already exists'() {
        const add = () => { snconfigfieldmodelstore_1.SnConfigFieldModelStore.Add({ FieldName: 'Example', Question: 'ExampleQuestion', Behavior: snconfigbehavior_1.SnConfigBehavior.Default, StoreKey: 'Example' }); };
        add(); // add once
        expect(add).to.throw(Error);
    }
    'SnConfigFieldModelStore Should throw an error if you try to add a field without StoreKey'() {
        const add = () => { snconfigfieldmodelstore_1.SnConfigFieldModelStore.Add({ FieldName: 'Example', Question: 'ExampleQuestion', Behavior: snconfigbehavior_1.SnConfigBehavior.Default }); };
        expect(add).to.throw(Error);
    }
    'GetCommandOptions should return only commands that has AllowFromCommandLine flag'() {
        const commands = snconfigfieldmodelstore_1.SnConfigFieldModelStore.GetCommandOptions();
        commands.forEach((command) => {
            const isAllowed = (command.Behavior & snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine) === snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine;
            expect(isAllowed).to.eq(true);
        });
    }
    'DEFAULT_BASE_URL should be equals to window.location.origin, if available'() {
        const empty = snconfigmodel_1.SnConfigModel.DEFAULT_BASE_URL;
        expect(empty).to.be.eq('');
        global.window = {
            location: {
                origin: 'http://google.com'
            }
        };
        const origin = snconfigmodel_1.SnConfigModel.DEFAULT_BASE_URL;
        expect(origin).to.be.eq('http://google.com');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "SnConfigFieldModel Should be constructed with SnConfigBehavior.Default", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "SnConfigFieldModelStore return the Entity in the store ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "SnConfigFieldModelStore Should throw error if entity isn't in the store ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "SnConfigFieldModelStore Should throw an error if you try to add a field that already exists", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "SnConfigFieldModelStore Should throw an error if you try to add a field without StoreKey", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "GetCommandOptions should return only commands that has AllowFromCommandLine flag", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnConfigTests.prototype, "DEFAULT_BASE_URL should be equals to window.location.origin, if available", null);
SnConfigTests = __decorate([
    mocha_typescript_1.suite('SnConfig')
], SnConfigTests);
exports.SnConfigTests = SnConfigTests;
//# sourceMappingURL=SnConfigTests.js.map