"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const SN_1 = require("../src/SN");
const MockRepository_1 = require("./Mocks/MockRepository");
const expect = Chai.expect;
exports.tests = describe('ODataHelper', () => {
    describe('#IsItemPath()', () => {
        it('should return true if the given path is a path of an item', () => {
            const isAnItem = SN_1.ODataHelper.isItemPath("/workspace('project')");
            expect(isAnItem).to.be.eq(true);
        });
        it('should return false if the given path is a path of a collection', () => {
            const isNotAnItem = SN_1.ODataHelper.isItemPath('/workspace');
            expect(isNotAnItem).to.be.eq(false);
        });
    });
    describe('#getContentUrlbyId()', () => {
        it('should return a proper item path by the given id', () => {
            const contentUrl = SN_1.ODataHelper.getContentUrlbyId(1);
            expect(contentUrl).to.be.eq('/content(1)');
        });
    });
    describe('#getContentURLbyPath()', () => {
        it('should return a proper item path by the given path', () => {
            const contentUrl = SN_1.ODataHelper.getContentURLbyPath('/workspace/project');
            expect(contentUrl).to.be.eq("/workspace('project')");
        });
        it('should return the path itself if it is an item path already', () => {
            const contentUrl = SN_1.ODataHelper.getContentURLbyPath("/workspace('project')");
            expect(contentUrl).to.be.eq("/workspace('project')");
        });
        it('should return an error message if the given argument is an empty string', () => {
            expect(() => { SN_1.ODataHelper.getContentURLbyPath(''); })
                .to.throws();
        });
        it('should return a proper item path for Root only', () => {
            const path = SN_1.ODataHelper.getContentURLbyPath('/Root');
            expect(path).to.be.eq("/('Root')");
        });
    });
});
describe('#buildUrlParamString()', () => {
    let repo;
    beforeEach(() => {
        repo = new MockRepository_1.MockRepository();
    });
    it('should return an empty string, if the argument is undefined', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString(repo.Config);
        expect(urlParamString).to.be.eq('');
    });
    it("should return a string with only select Id and Type if there's no selected field", () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultSelect: ['Id', 'Type'] }, { metadata: 'no' });
        expect(urlParamString).to.be.eq('metadata=no&$select=Id,Type');
    });
    it('should return a string with the given field and Id and Type as selected', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ RequiredSelect: ['Id', 'Type'], DefaultMetadata: 'no' }, { select: 'DisplayName' });
        expect(urlParamString).to.be.eq('$select=Id,Type,DisplayName&metadata=no');
    });
    it('should return a string with the given fields and Id and Type as selected', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ RequiredSelect: ['Id', 'Type'], DefaultMetadata: 'no' }, { select: ['DisplayName', 'Path'] });
        expect(urlParamString).to.be.eq('$select=Id,Type,DisplayName,Path&metadata=no');
    });
    it('should return a string with the given parameters', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ RequiredSelect: ['Id', 'Type'], DefaultMetadata: 'no' }, { select: ['DisplayName', 'Path'], orderby: 'DisplayName' });
        expect(urlParamString).to.be.eq('$select=Id,Type,DisplayName,Path&$orderby=DisplayName&metadata=no');
    });
    it('should return a string with the given parameters', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ RequiredSelect: ['Id', 'Type'], DefaultMetadata: 'no' }, { select: ['DisplayName', 'Path'], orderby: 'DisplayName', query: "isOf('Article')" });
        expect(urlParamString).to.be.eq("$select=Id,Type,DisplayName,Path&$orderby=DisplayName&query=isOf('Article')&metadata=no");
    });
    it('should return a string without select param', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: 'DisplayName' });
        expect(urlParamString).to.be.eq('$orderby=DisplayName&metadata=no');
    });
    it('should parse a single orderby expression', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: 'Name' });
        expect(urlParamString).to.be.eq('$orderby=Name&metadata=no');
    });
    it('should parse an orderby array with fields expression', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: ['Name', 'DisplayName'] });
        expect(urlParamString).to.be.eq('$orderby=Name,DisplayName&metadata=no');
    });
    it('should parse an orderby field expression with order', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: [['Name', 'asc']] });
        expect(urlParamString).to.be.eq('$orderby=Name asc&metadata=no');
    });
    it('should parse an orderby array with ordered fields list expression', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: [['Name', 'asc'], ['DisplayName', 'desc']] });
        expect(urlParamString).to.be.eq('$orderby=Name asc,DisplayName desc&metadata=no');
    });
    it('should parse an orderby array with ordered fields list expression and field names', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ DefaultMetadata: 'no' }, { orderby: [['Name', 'asc'], 'DisplayName'] });
        expect(urlParamString).to.be.eq('$orderby=Name asc,DisplayName&metadata=no');
    });
    it('should return a string without any param', () => {
        const urlParamString = SN_1.ODataHelper.buildUrlParamString({ RequiredSelect: ['Id', 'Type'], DefaultMetadata: 'no' });
        expect(urlParamString).to.be.eq('');
    });
});
describe('#joinPaths', () => {
    it('should join with slashes', () => {
        const joined = SN_1.ODataHelper.joinPaths('path1', 'path2', 'path3');
        expect(joined).to.be.eq('path1/path2/path3');
    });
    it('should remove slashes from the beginning of the segments', () => {
        const joined = SN_1.ODataHelper.joinPaths('/path1', 'path2/', '/path3');
        expect(joined).to.be.eq('path1/path2/path3');
    });
    it('should remove slashes from the end of the segments', () => {
        const joined = SN_1.ODataHelper.joinPaths('path1', 'path2/', 'path3/');
        expect(joined).to.be.eq('path1/path2/path3');
    });
});
//# sourceMappingURL=ODataHelperTests.js.map