"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const ComplexTypes_1 = require("../src/ComplexTypes");
const expect = Chai.expect;
exports.ComplexTypesTests = describe('ComplexTypes', () => {
    describe('#ChoiceOption', () => {
        const option = new ComplexTypes_1.ChoiceOption('text');
        it('should return a choice option object', () => {
            expect(option).to.be.an.instanceof(ComplexTypes_1.ChoiceOption);
        });
    });
    describe('#DeferredObject', () => {
        const link = new ComplexTypes_1.DeferredObject();
        it('should return a DeferredObject object', () => {
            expect(link).to.be.an.instanceof(ComplexTypes_1.DeferredObject);
        });
    });
    describe('#DeferredUriObject', () => {
        const link = new ComplexTypes_1.DeferredUriObject();
        it('should return a DeferredUriObject object', () => {
            expect(link).to.be.an.instanceof(ComplexTypes_1.DeferredUriObject);
        });
    });
    describe('#MediaResourceObject', () => {
        const link = new ComplexTypes_1.MediaResourceObject();
        it('should return a MediaResourceObject object', () => {
            expect(link).to.be.an.instanceof(ComplexTypes_1.MediaResourceObject);
        });
    });
    describe('#Hyperlink', () => {
        const link = new ComplexTypes_1.MediaObject();
        it('should return a hyperlink object', () => {
            expect(link).to.be.an.instanceof(ComplexTypes_1.MediaObject);
        });
    });
});
//# sourceMappingURL=ComplexTypesTests.js.map