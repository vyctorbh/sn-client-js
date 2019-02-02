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
const ContentTypes_1 = require("../src/ContentTypes");
const Query_1 = require("../src/Query");
const SN_1 = require("../src/SN");
const index_1 = require("./Mocks/index");
const expect = Chai.expect;
let QueryTests = class QueryTests {
    'Can be constructed'() {
        const query = new Query_1.Query((q) => q);
        expect(query).to.be.instanceof(Query_1.Query);
    }
    'Can be from a repository'(done) {
        const repo = new index_1.MockRepository();
        repo.Authentication.StateSubject.next(LoginState_1.LoginState.Authenticated);
        repo.HttpProviderRef.AddResponse({
            d: {
                __count: 1,
                results: [{
                        Id: 1,
                        Name: 'Test',
                        Type: 'Folder',
                        Path: 'Root/Tasks'
                    }]
            }
        });
        const query = repo.CreateQuery((q) => q.TypeIs(SN_1.ContentTypes.Folder));
        query.Exec()
            .subscribe((res) => {
            expect(res.Count).to.be.eq(1);
            expect(res.Result[0]).to.be.instanceof(SN_1.ContentInternal);
            expect(res.Result[0].Type).to.be.eq('Folder');
            done();
        }, done);
        expect(query.toString()).to.be.eq('TypeIs:Folder');
    }
    'Should throw Error when try to run from a Content without Path'() {
        const repo = new index_1.MockRepository();
        const content = repo.HandleLoadedContent({
            Id: 3,
            Name: 'ExampleFolder',
            Type: 'Folder'
        }, ContentTypes_1.Folder);
        expect(() => content.CreateQuery((q) => q.TypeIs(SN_1.ContentTypes.Folder))).to.throw('No Content path provided for querying');
    }
    'Can be from a Content'(done) {
        const repo = new index_1.MockRepository();
        repo.Authentication.StateSubject.next(LoginState_1.LoginState.Authenticated);
        repo.HttpProviderRef.AddResponse({
            d: {
                __count: 1,
                results: [{
                        Id: 1,
                        Name: 'Test',
                        Type: 'Folder',
                        Path: 'Root/Folders'
                    }]
            }
        });
        const content = repo.HandleLoadedContent({
            Id: 3,
            Path: 'Root/Content/Folders',
            Type: 'Folder',
            Name: 'test'
        });
        const query = content.CreateQuery((q) => q.TypeIs(SN_1.ContentTypes.Folder));
        query.Exec().subscribe((res) => {
            expect(res.Count).to.be.eq(1);
            expect(res.Result[0]).to.be.instanceof(SN_1.ContentInternal);
            expect(res.Result[0].Type).to.be.eq('Folder');
            done();
        }, done);
        expect(query.toString()).to.be.eq('TypeIs:Folder');
    }
    'Term syntax'() {
        const queryInstance = new Query_1.Query((q) => q.Term('test term'));
        expect(queryInstance.toString()).to.be.eq('test term');
    }
    'TypeIs syntax'() {
        const queryInstance = new Query_1.Query((q) => q.TypeIs(SN_1.ContentTypes.Task));
        expect(queryInstance.toString()).to.be.eq('TypeIs:Task');
    }
    'Type syntax'() {
        const queryInstance = new Query_1.Query((q) => q.Type(SN_1.ContentTypes.Task));
        expect(queryInstance.toString()).to.be.eq('Type:Task');
    }
    'InFolder with Path'() {
        const queryInstance = new Query_1.Query((q) => q.InFolder('a/b/c'));
        expect(queryInstance.toString()).to.be.eq('InFolder:"a/b/c"');
    }
    'InFolder with Content'() {
        const repo = new index_1.MockRepository();
        const content = repo.HandleLoadedContent({ Id: 2, Path: 'a/b/c', Name: 'test', Type: 'Task' });
        const queryInstance = new Query_1.Query((q) => q.InFolder(content));
        expect(queryInstance.toString()).to.be.eq('InFolder:"a/b/c"');
    }
    'InTree with Path'() {
        const queryInstance = new Query_1.Query((q) => q.InTree('a/b/c'));
        expect(queryInstance.toString()).to.be.eq('InTree:"a/b/c"');
    }
    'InTree with Content'() {
        const repo = new index_1.MockRepository();
        const content = repo.HandleLoadedContent({ Id: 2, Path: 'a/b/c', Name: 'test', Type: 'Task' });
        const queryInstance = new Query_1.Query((q) => q.InTree(content));
        expect(queryInstance.toString()).to.be.eq('InTree:"a/b/c"');
    }
    'Equals'() {
        const queryInstance = new Query_1.Query((q) => q.Equals('DisplayName', 'test'));
        expect(queryInstance.toString()).to.be.eq('DisplayName:\'test\'');
    }
    'NotEquals'() {
        const queryInstance = new Query_1.Query((q) => q.NotEquals('DisplayName', 'test'));
        expect(queryInstance.toString()).to.be.eq('NOT(DisplayName:\'test\')');
    }
    'Between exclusive'() {
        const queryInstance = new Query_1.Query((q) => q.Between('Index', 1, 5));
        expect(queryInstance.toString()).to.be.eq('Index:{\'1\' TO \'5\'}');
    }
    'Between Inclusive'() {
        const queryInstance = new Query_1.Query((q) => q.Between('Index', 10, 50, true, true));
        expect(queryInstance.toString()).to.be.eq('Index:[\'10\' TO \'50\']');
    }
    'GreatherThan Exclusive'() {
        const queryInstance = new Query_1.Query((q) => q.GreatherThan('Index', 10));
        expect(queryInstance.toString()).to.be.eq('Index:>\'10\'');
    }
    'GreatherThan Inclusive'() {
        const queryInstance = new Query_1.Query((q) => q.GreatherThan('Index', 10, true));
        expect(queryInstance.toString()).to.be.eq('Index:>=\'10\'');
    }
    'LessThan Exclusive'() {
        const queryInstance = new Query_1.Query((q) => q.LessThan('Index', 10));
        expect(queryInstance.toString()).to.be.eq('Index:<\'10\'');
    }
    'LessThan Inclusive'() {
        const queryInstance = new Query_1.Query((q) => q.LessThan('Index', 10, true));
        expect(queryInstance.toString()).to.be.eq('Index:<=\'10\'');
    }
    'AND syntax'() {
        const queryInstance = new Query_1.Query((q) => q.Equals('Index', 1).And.Equals('DisplayName', 'Test'));
        expect(queryInstance.toString()).to.be.eq("Index:'1' AND DisplayName:'Test'");
    }
    'OR syntax'() {
        const queryInstance = new Query_1.Query((q) => q.Equals('Index', 1).Or.Equals('DisplayName', 'Test'));
        expect(queryInstance.toString()).to.be.eq("Index:'1' OR DisplayName:'Test'");
    }
    'inner Query'() {
        const queryInstance = new Query_1.Query((q) => q.Equals('DisplayName', 'Test')
            .And
            .Query((inner) => inner.Equals('Index', 1)));
        expect(queryInstance.toString()).to.be.eq("DisplayName:'Test' AND (Index:'1')");
    }
    'NOT statement'() {
        const queryInstance = new Query_1.Query((q) => q.Equals('DisplayName', 'Test')
            .And
            .Not((inner) => inner.Equals('Index', 1)));
        expect(queryInstance.toString()).to.be.eq("DisplayName:'Test' AND NOT(Index:'1')");
    }
    'OrderBy'() {
        const queryInstance = new Query_1.Query((q) => q.Sort('DisplayName'));
        expect(queryInstance.toString()).to.be.eq(" .SORT:'DisplayName'");
    }
    'OrderBy Reverse'() {
        const queryInstance = new Query_1.Query((q) => q.Sort('DisplayName', true));
        expect(queryInstance.toString()).to.be.eq(" .REVERSESORT:'DisplayName'");
    }
    'Top'() {
        const queryInstance = new Query_1.Query((q) => q.Top(50));
        expect(queryInstance.toString()).to.be.eq(' .TOP:50');
    }
    'Skip'() {
        const queryInstance = new Query_1.Query((q) => q.Skip(10));
        expect(queryInstance.toString()).to.be.eq(' .SKIP:10');
    }
    'Issue Example output'() {
        const query = new Query_1.Query((q) => q.TypeIs(SN_1.ContentTypes.Task) // adds '+TypeIs:Document' and Typescript type cast
            .And
            .Equals('DisplayName', 'Unicorn') // adds +Title:Unicorn (TBD: fuzzy/Proximity)
            .And
            .Between('ModificationDate', '2017-01-01T00:00:00', '2017-02-01T00:00:00')
            .Or
            .Query((sub) => sub // Grouping
            .NotEquals('Approvable', true)
            .And
            .NotEquals('Description', '*alma*') // Contains with wildcards
        )
            .Sort('DisplayName')
            .Top(5) // adds .TOP:5
            .Skip(10) // adds .SKIP:10
        );
        expect(query.toString()).to.be
            .eq("TypeIs:Task AND DisplayName:'Unicorn' AND ModificationDate:{'2017-01-01T00\\:00\\:00' TO '2017-02-01T00\\:00\\:00'} OR (NOT(Approvable:'true') AND NOT(Description:'*alma*')) .SORT:'DisplayName' .TOP:5 .SKIP:10");
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Can be constructed", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Can be from a repository", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Should throw Error when try to run from a Content without Path", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Can be from a Content", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Term syntax", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "TypeIs syntax", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Type syntax", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "InFolder with Path", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "InFolder with Content", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "InTree with Path", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "InTree with Content", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Equals", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "NotEquals", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Between exclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Between Inclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "GreatherThan Exclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "GreatherThan Inclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "LessThan Exclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "LessThan Inclusive", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "AND syntax", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "OR syntax", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "inner Query", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "NOT statement", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "OrderBy", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "OrderBy Reverse", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Top", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Skip", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueryTests.prototype, "Issue Example output", null);
QueryTests = __decorate([
    mocha_typescript_1.suite('Query tests')
], QueryTests);
exports.QueryTests = QueryTests;
//# sourceMappingURL=QueryTests.js.map