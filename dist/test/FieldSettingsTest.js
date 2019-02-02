"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const FieldSettings = require("../src/FieldSettings");
const expect = Chai.expect;
exports.FieldSettingsTests = describe('FieldSettings', () => {
    describe('#FieldSetting type guard', () => {
        let fieldSetting;
        beforeEach(() => {
            fieldSetting = { Name: 'ShortText', Type: 'ShortTextFieldSetting' };
        });
        it('should return true for ShortText', () => {
            expect(FieldSettings.isFieldSettingOfType(fieldSetting, FieldSettings.ShortTextFieldSetting)).to.be.eq(true);
        });
    });
});
//# sourceMappingURL=FieldSettingsTest.js.map