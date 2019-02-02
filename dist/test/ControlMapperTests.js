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
const ContentTypes = require("../src/ContentTypes");
const ControlMapper_1 = require("../src/ControlMapper");
const FieldSettings_1 = require("../src/FieldSettings");
const SN_1 = require("../src/SN");
const MockRepository_1 = require("./Mocks/MockRepository");
class ExampleControlBase {
}
class ExampleDefaultControl extends ExampleControlBase {
}
class ExampleModifiedControl extends ExampleControlBase {
}
class ExampleModifiedControl2 extends ExampleControlBase {
}
class ExampleDefaultFieldControl extends ExampleControlBase {
}
class ExampleClientSetting {
    constructor(Setting) {
        this.Setting = Setting;
    }
}
let ControlMapperTests = class ControlMapperTests {
    // tslint:disable-next-line:naming-convention
    before() {
        this._repository = new MockRepository_1.MockRepository();
        this._mapper = new ControlMapper_1.ControlMapper(this._repository, ExampleControlBase, (setting) => new ExampleClientSetting(setting), ExampleDefaultControl, ExampleDefaultFieldControl);
    }
    'example'() {
        Chai.expect(this._mapper).to.be.instanceof(ControlMapper_1.ControlMapper);
    }
    'Should be able to construct with BaseType and ClientControlSettingsFactory'() {
        const mapper = new ControlMapper_1.ControlMapper(this._repository, ExampleControlBase, (setting) => new ExampleClientSetting(setting));
        Chai.expect(mapper).to.be.instanceof(ControlMapper_1.ControlMapper);
    }
    'Should be able to construct with all parameters'() {
        const mapper = new ControlMapper_1.ControlMapper(this._repository, ExampleControlBase, (setting) => new ExampleClientSetting(setting), ExampleDefaultControl, ExampleDefaultFieldControl);
        Chai.expect(mapper).to.be.instanceof(ControlMapper_1.ControlMapper);
    }
    'Should return correct Default Control for ContentTypes'() {
        const controlType = this._mapper.GetControlForContentType(ContentTypes_1.Task);
        Chai.expect(controlType).to.be.eq(ExampleDefaultControl);
    }
    'Should return correct explicit defined Control for ContentTypes'() {
        this._mapper.MapContentTypeToControl(ContentTypes_1.Task, ExampleModifiedControl);
        const controlType = this._mapper.GetControlForContentType(ContentTypes_1.Task);
        Chai.expect(controlType).to.be.eq(ExampleModifiedControl);
    }
    'Should return correct Default Control for FieldSettings'() {
        const fs = {};
        const controlType = this._mapper.GetControlForFieldSetting(fs);
        Chai.expect(controlType).to.be.eq(ExampleDefaultFieldControl);
    }
    'Should return correct explicit defined Control for FieldSettings'() {
        this._mapper.SetupFieldSettingDefault(FieldSettings_1.ChoiceFieldSetting, (setting) => {
            if (setting.Compulsory) {
                return ExampleModifiedControl;
            }
            return ExampleDefaultFieldControl;
        });
        const fs = { Compulsory: true, Type: 'ChoiceFieldSetting' };
        const controlType = this._mapper.GetControlForFieldSetting(fs);
        Chai.expect(controlType).to.be.eq(ExampleModifiedControl);
        const fs2 = { Compulsory: false, Type: 'ChoiceFieldSetting' };
        const controlType2 = this._mapper.GetControlForFieldSetting(fs2);
        Chai.expect(controlType2).to.be.eq(ExampleDefaultFieldControl);
    }
    'Should return a correct default control for a specified Content Field'() {
        const control = this._mapper.GetControlForContentField(ContentTypes_1.Task, 'DisplayName', 'new');
        Chai.expect(control).to.be.eq(ExampleDefaultFieldControl);
    }
    'Should return a correct default control for a specified Content Field when FieldSetting has default value'() {
        this._mapper.SetupFieldSettingDefault(FieldSettings_1.ShortTextFieldSetting, (setting) => {
            return ExampleModifiedControl;
        });
        const control = this._mapper.GetControlForContentField(ContentTypes_1.Task, 'DisplayName', 'new');
        Chai.expect(control).to.be.eq(ExampleModifiedControl);
        const controlOther = this._mapper.GetControlForContentField(ContentTypes_1.User, 'DisplayName', 'new');
        Chai.expect(controlOther).to.be.eq(ExampleModifiedControl);
        const controlOtherDateTime = this._mapper.GetControlForContentField(ContentTypes_1.Task, 'DueDate', 'new');
        Chai.expect(controlOtherDateTime).to.be.eq(ExampleDefaultFieldControl);
    }
    'Should return a correct default control for a specified Content Field when there is a ContentType bound setting specified'() {
        this._mapper.SetupFieldSettingForControl(ContentTypes_1.Task, 'DisplayName', (setting) => {
            return ExampleModifiedControl2;
        });
        const control = this._mapper.GetControlForContentField(ContentTypes_1.Task, 'DisplayName', 'new');
        Chai.expect(control).to.be.eq(ExampleModifiedControl2);
        const control2 = this._mapper.GetControlForContentField(ContentTypes_1.User, 'DisplayName', 'new');
        Chai.expect(control2).to.be.eq(ExampleDefaultFieldControl);
    }
    'CreateClientSetting should run with defult factory method by default'() {
        const fieldSetting = { DisplayName: 'TestField' };
        const clientSetting = this._mapper.CreateClientSetting(fieldSetting);
        Chai.expect(clientSetting.Setting.DisplayName).to.be.eq(fieldSetting.DisplayName);
    }
    'CreateClientSetting should be able to run with an overridden factory method'() {
        const fieldSetting = { DisplayName: 'TestField', Type: 'ShortTextFieldSetting' };
        this._mapper.SetClientControlFactory(FieldSettings_1.ShortTextFieldSetting, ((setting) => {
            setting.DisplayName = (setting.DisplayName || '').toUpperCase();
            return new ExampleClientSetting(setting);
        }));
        const clientSetting = this._mapper.CreateClientSetting(fieldSetting);
        Chai.expect(clientSetting.Setting.DisplayName).to.be.eq('TESTFIELD');
    }
    'GetAllMappingsForContentTye should be able to return all mappings'() {
        // tslint:disable-next-line:forin
        for (const key in ContentTypes) {
            const fullMapping = this._mapper.GetFullSchemaForContentType(ContentTypes[key], 'new');
            Chai.expect(fullMapping.FieldMappings.length).to.be.greaterThan(0);
            fullMapping.FieldMappings.forEach((m) => {
                Chai.expect(m.ClientSettings).to.be.instanceof(ExampleClientSetting);
                Chai.expect(m.ControlType).to.be.eq(ExampleDefaultFieldControl);
            });
        }
    }
    'GetAllMappingsForContentTye filtered to View should be able to return all mappings'() {
        const fullMapping = this._mapper.GetFullSchemaForContentType(ContentTypes_1.Task, 'view').FieldMappings;
        Chai.expect(fullMapping.length).to.be.greaterThan(0);
        fullMapping.forEach((m) => {
            Chai.expect(m.ClientSettings.Setting.VisibleBrowse).to.be.eq(FieldSettings_1.FieldVisibility.Show);
            Chai.expect(m.ClientSettings).to.be.instanceof(ExampleClientSetting);
            Chai.expect(m.ControlType).to.be.eq(ExampleDefaultFieldControl);
        });
    }
    'GetAllMappingsForContentTye filtered to Edit should be able to return all mappings'() {
        const fullMapping = this._mapper.GetFullSchemaForContentType(ContentTypes_1.Task, 'edit').FieldMappings;
        Chai.expect(fullMapping.length).to.be.greaterThan(0);
        fullMapping.forEach((m) => {
            Chai.expect(m.ClientSettings.Setting.VisibleEdit).to.be.eq(FieldSettings_1.FieldVisibility.Show);
            Chai.expect(m.ClientSettings).to.be.instanceof(ExampleClientSetting);
            Chai.expect(m.ControlType).to.be.eq(ExampleDefaultFieldControl);
        });
    }
    'GetAllMappingsForContentTye filtered to New should be able to return all mappings'() {
        const fullMapping = this._mapper.GetFullSchemaForContentType(ContentTypes_1.Task, 'new').FieldMappings;
        Chai.expect(fullMapping.length).to.be.greaterThan(0);
        fullMapping.forEach((m) => {
            Chai.expect(m.ClientSettings.Setting.VisibleNew).to.be.eq(FieldSettings_1.FieldVisibility.Show);
            Chai.expect(m.ClientSettings).to.be.instanceof(ExampleClientSetting);
            Chai.expect(m.ControlType).to.be.eq(ExampleDefaultFieldControl);
        });
    }
    'GetFullSchemaForContent filtered to New should be able to return all mappings'() {
        const fullMapping = this._mapper.GetFullSchemaForContent(SN_1.ContentInternal.Create({ DueDate: '2017-06-27T11:11:11Z', Name: 'Task1' }, ContentTypes_1.Task, new MockRepository_1.MockRepository()), 'new').FieldMappings;
        Chai.expect(fullMapping.length).to.be.greaterThan(0);
        fullMapping.forEach((m) => {
            Chai.expect(m.ClientSettings).to.be.instanceof(ExampleClientSetting);
            Chai.expect(m.ControlType).to.be.eq(ExampleDefaultFieldControl);
        });
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "example", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should be able to construct with BaseType and ClientControlSettingsFactory", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should be able to construct with all parameters", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return correct Default Control for ContentTypes", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return correct explicit defined Control for ContentTypes", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return correct Default Control for FieldSettings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return correct explicit defined Control for FieldSettings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return a correct default control for a specified Content Field", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return a correct default control for a specified Content Field when FieldSetting has default value", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "Should return a correct default control for a specified Content Field when there is a ContentType bound setting specified", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "CreateClientSetting should run with defult factory method by default", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "CreateClientSetting should be able to run with an overridden factory method", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "GetAllMappingsForContentTye should be able to return all mappings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "GetAllMappingsForContentTye filtered to View should be able to return all mappings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "GetAllMappingsForContentTye filtered to Edit should be able to return all mappings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "GetAllMappingsForContentTye filtered to New should be able to return all mappings", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlMapperTests.prototype, "GetFullSchemaForContent filtered to New should be able to return all mappings", null);
ControlMapperTests = __decorate([
    mocha_typescript_1.suite('ControlMapper')
], ControlMapperTests);
exports.ControlMapperTests = ControlMapperTests;
//# sourceMappingURL=ControlMapperTests.js.map