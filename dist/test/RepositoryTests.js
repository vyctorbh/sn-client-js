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
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
const Authentication_1 = require("../src/Authentication");
const Config_1 = require("../src/Config");
const Content_1 = require("../src/Content");
const ContentTypes_1 = require("../src/ContentTypes");
const ODataApi_1 = require("../src/ODataApi");
const Repository_1 = require("../src/Repository");
const Schemas_1 = require("../src/Schemas");
const Mocks_1 = require("./Mocks");
const expect = Chai.expect;
let RepositoryTests = class RepositoryTests {
    // tslint:disable-next-line:naming-convention
    before() {
        this._repo = new Mocks_1.MockRepository({
            RepositoryUrl: 'https://localhost',
            ODataToken: 'odata.svc'
        });
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
    }
    'ODataBaseUrl should return a valid URL based on RepositoryUrl and ODataToken'() {
        expect(this._repo.ODataBaseUrl).to.be.eq('https://localhost/odata.svc');
    }
    'GetVersionInfo should return a valid Version Info'() {
        const vResponse = new Repository_1.VersionInfo();
        vResponse.DatabaseAvailable = true;
        this._repo.HttpProviderRef.AddResponse(vResponse);
        this._repo.GetVersionInfo().first().subscribe((result) => {
            expect(result.DatabaseAvailable).to.be.eq(true);
        });
    }
    'GetAllContentTypes should be return a valid content type collection'(done) {
        const cResponse = {
            d: {
                __count: 1,
                results: [
                    {
                        Name: 'testContentType',
                        Type: 'ContentType',
                    }
                ]
            }
        };
        this._repo.HttpProviderRef.AddResponse(cResponse);
        this._repo.GetAllContentTypes().first().subscribe((types) => {
            expect(types.length).to.be.eq(1);
            expect(types[0].Name).to.be.eq('testContentType');
            expect(types[0]).to.be.instanceof(Content_1.ContentInternal);
            done();
        }, done);
    }
    'Load should return a valid Content'(done) {
        const cResponse = {
            d: {
                Name: 'testContentType',
                Type: 'ContentType'
            }
        };
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.HttpProviderRef.AddResponse(cResponse);
        this._repo.Load(1).first().subscribe((response) => {
            expect(response.Name).to.be.eq('testContentType');
            expect(response).to.be.instanceof(Content_1.ContentInternal);
            done();
        }, (err) => {
            done(err);
        });
    }
    'Load should return a valid Content with a valid type, if defined'(done) {
        const cResponse = {
            d: {
                Name: 'testContentType',
                Type: 'User',
                LoginName: 'alba'
            }
        };
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.HttpProviderRef.AddResponse(cResponse);
        this._repo.Load(1).first().subscribe((response) => {
            expect(response.LoginName).to.be.eq('alba'); // For type checking
            expect(response.Name).to.be.eq('testContentType');
            expect(response).to.be.instanceof(Content_1.ContentInternal);
            done();
        }, (err) => {
            done(err);
        });
    }
    'SnRepository should have a default Config, if not provided'() {
        const snRepo = new Repository_1.SnRepository();
        expect(snRepo.Config.RepositoryUrl).to.be.eq(Config_1.SnConfigModel.DEFAULT_BASE_URL);
    }
    'SnRepository should respect the provided config'() {
        const snRepo = new Repository_1.SnRepository(new Config_1.SnConfigModel({
            RepositoryUrl: 'https://demo.sensenet.com'
        }));
        expect(snRepo.Config.RepositoryUrl).to.be.eq('https://demo.sensenet.com');
    }
    'HandleLoadedContent should respect content type (with fields) from generic'() {
        const snRepo = new Repository_1.SnRepository(new Config_1.SnConfigModel({
            RepositoryUrl: 'https://demo.sensenet.com'
        }));
        const task = snRepo.HandleLoadedContent({
            Id: 100,
            Path: 'Root/Test',
            Type: 'Task',
            Name: 'Task',
            DueText: 'testDueText'
        });
        const usr = snRepo.HandleLoadedContent({
            Id: 200,
            Path: 'Root/Test',
            Name: 'User',
            Type: 'User',
            LoginName: 'testLoginName'
        });
        const content = snRepo.HandleLoadedContent({
            Id: 300,
            Path: 'Root/Test',
            Name: ''
        });
        expect(task).to.be.instanceof(Content_1.ContentInternal);
        expect(task.DueText).to.be.eq('testDueText');
        expect(usr).to.be.instanceof(Content_1.ContentInternal);
        expect(usr.LoginName).to.be.eq('testLoginName');
        expect(content).to.be.instanceof(Content_1.ContentInternal);
    }
    'Content should return an ODataApi instance'() {
        const snRepo = new Repository_1.SnRepository();
        expect(snRepo.Content).to.be.instanceOf(ODataApi_1.ODataApi);
    }
    'Should be able to create content using repository.CreateContent() '() {
        const snRepo = new Repository_1.SnRepository();
        const exampleTask = snRepo.CreateContent({ DueText: 'testDueText' }, ContentTypes_1.Task);
        expect(exampleTask).to.be.instanceOf(Content_1.ContentInternal);
        expect(exampleTask.DueText).to.be.eq('testDueText');
    }
    'DeleteBatch() should fire a DeleteBatch request'(done) {
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 0, errors: [], results: [] } });
        const testContent = this._repo.HandleLoadedContent({
            Id: 12345, Path: 'Root/Test', Name: 'Task'
        });
        this._repo.DeleteBatch([testContent]).subscribe((r) => {
            expect(this._repo.HttpProviderRef.LastOptions.url).to.contains("https://localhost/odata.svc/('Root')/DeleteBatch");
            expect(this._repo.HttpProviderRef.LastOptions.body).to.be.eq('{"paths":[12345],"permanent":false}');
            expect(this._repo.HttpProviderRef.LastOptions.method).to.be.eq('POST');
            done();
        }, (err) => {
            done(err);
        });
    }
    'DeleteBatch() should fire a DeleteBatch request by path'(done) {
        const testContentWithoutId = this._repo.HandleLoadedContent({ Path: 'Root/Test2' });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 0, errors: [], results: [] } });
        this._repo.DeleteBatch([testContentWithoutId]).subscribe((res) => {
            expect(this._repo.HttpProviderRef.LastOptions.url).to.contains("https://localhost/odata.svc/('Root')/DeleteBatch");
            expect(this._repo.HttpProviderRef.LastOptions.body).to.be.eq('{"paths":["Root/Test2"],"permanent":false}');
            expect(this._repo.HttpProviderRef.LastOptions.method).to.be.eq('POST');
            done();
        }, (err) => done(err));
    }
    'DeleteBatch() should trigger ContentDeleted event after success'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'Task' });
        this._repo.Events.OnContentDeleted.subscribe((c) => {
            expect(c.ContentData.Id).to.be.eq(testContent.Id);
            done();
        });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 1, errors: [], results: [{ Id: 12345, Path: 'Root/Test', Name: 'Task' }] } });
        const action = this._repo.DeleteBatch([testContent]);
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'DeleteBatch() should trigger ContentDeleteFailed event on errored operations'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'Task' });
        this._repo.Events.OnContentDeleteFailed.subscribe((c) => {
            expect(c.Content).to.be.eq(testContent);
            done();
        }, (err) => done(err));
        this._repo.HttpProviderRef.AddResponse({
            d: {
                __count: 1,
                results: [],
                errors: [
                    {
                        content: { Id: 12345, Path: 'Root/Test', Name: 'Task' },
                        error: { message: '' }
                    }
                ]
            }
        });
        const action = this._repo.DeleteBatch([testContent]);
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'DeleteBatch() should return error on fail'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'Task' });
        this._repo.HttpProviderRef.AddError(Error(':('));
        const action = this._repo.DeleteBatch([testContent]);
        action.subscribe(() => {
            done('This shouldn\'t be triggered');
        }, (err) => done());
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'MoveBatch() should fire a MoveBatch request'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'Task' });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 0 } });
        this._repo.MoveBatch([testContent], 'Root/Test2').subscribe((r) => {
            expect(this._repo.HttpProviderRef.LastOptions.url).to.contains("https://localhost/odata.svc/('Root')/MoveBatch");
            expect(this._repo.HttpProviderRef.LastOptions.body).to.be.eq('[{"paths":["Root/Test"],"targetPath":"Root/Test2"}]');
            expect(this._repo.HttpProviderRef.LastOptions.method).to.be.eq('POST');
            done();
        });
    }
    'MoveBatch() should trigger ContentMoved event after success'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        const sourcePath = testContent.Path;
        this._repo.Events.OnContentMoved.subscribe((c) => {
            expect(c.Content.Id).to.be.eq(testContent.Id);
            expect(c.From).to.be.eq(sourcePath);
            expect(c.To).to.be.eq('Root/Test2');
            done();
        });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 1, errors: [], results: [{
                        Id: 12345,
                        Path: 'Root/Test2',
                        Name: 'Task'
                    }] } });
        const action = this._repo.MoveBatch([testContent], 'Root/Test2');
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'MoveBatch() should trigger ContentMoveFailed event after failure'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnContentMoveFailed.subscribe((c) => {
            expect(c.Content).to.be.eq(testContent);
            done();
        });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 1, results: [], errors: [{
                        content: {
                            Id: 12345,
                            Path: 'Root/Test2',
                            Name: 'Task'
                        },
                        error: ':('
                    }] } });
        const action = this._repo.MoveBatch([testContent], 'Root/Test2');
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'MoveBatch() should trigger fail on request error'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.HttpProviderRef.AddError({ message: ':(' });
        const action = this._repo.MoveBatch([testContent], 'Root/Test2');
        action.subscribe(() => {
            done('Should fail');
        }, (err) => done());
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'CopyBatch() should fire a CopyBatch request'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 0 } });
        this._repo.CopyBatch([testContent], 'Root/Test2').subscribe((r) => {
            expect(this._repo.HttpProviderRef.LastOptions.url).to.contains("https://localhost/odata.svc/('Root')/CopyBatch");
            expect(this._repo.HttpProviderRef.LastOptions.body).to.be.eq('[{"paths":["Root/Test"],"targetPath":"Root/Test2"}]');
            expect(this._repo.HttpProviderRef.LastOptions.method).to.be.eq('POST');
            done();
        }, (err) => done(err));
    }
    'CopyBatch() should trigger ContentCreated event after success'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnContentCreated.subscribe((c) => {
            expect(c.Content.Id).to.be.eq(testContent.Id);
            done();
        });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 1, errors: [], results: [{
                        Id: 12345,
                        Path: 'Root/Test2',
                        Name: 'Task'
                    }] } });
        const action = this._repo.CopyBatch([testContent], 'Root/Test2');
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'CopyBatch() should trigger ContentCreateFailed event after failure'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnContentCreateFailed.subscribe((c) => {
            expect(c.Content.Id).to.be.eq(testContent.Id);
            done();
        });
        this._repo.HttpProviderRef.AddResponse({ d: { __count: 1, results: [], errors: [{
                        content: {
                            Id: 12345,
                            Path: 'Root/Test2',
                            Name: 'Task'
                        },
                        error: ':('
                    }] } });
        const action = this._repo.CopyBatch([testContent], 'Root/Test2');
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'CopyBatch() should fail on request error'(done) {
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.HttpProviderRef.AddError({ message: ':(' });
        const action = this._repo.CopyBatch([testContent], 'Root/Test2');
        action.subscribe((a) => {
            done('Should fail');
        }, (err) => {
            done();
        });
        expect(action).to.be.instanceof(Observable_1.Observable);
    }
    'UploadResponse can be constructed'() {
        const model = new Repository_1.UploadResponse('123', 'chunkToken', true, true);
        expect(model).to.be.instanceof(Repository_1.UploadResponse);
    }
    'Upload() should trigger UploadProgress event'(done) {
        this._repo.Config.ChunkSize = 1024 * 1024;
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnUploadProgress.subscribe((pi) => {
            expect(pi).to.be.instanceof(Object);
            done();
        }, (err) => done(err));
        this._repo.HttpProviderRef
            .AddResponse({ Id: 12356, Path: 'Root/Test/alma' })
            .AddResponse({ d: { Id: 12356, Path: 'Root/Test/alma' } });
        const mockFile = new File(['alma'], 'alma.txt');
        Object.assign(mockFile, {
            size: 8
        });
        testContent.UploadFile({ ContentType: ContentTypes_1.File, File: mockFile, PropertyName: 'Binary', Body: {}, Overwrite: true })
            .subscribe((progress) => { }, (err) => done(err));
    }
    'Upload() should trigger ContentCreated event'(done) {
        this._repo.Config.ChunkSize = 1024 * 1024;
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnContentCreated.subscribe((pi) => {
            expect(pi).to.be.instanceof(Object);
            done();
        }, (err) => done(err));
        this._repo.HttpProviderRef
            .AddResponse({ Id: 12356, Path: 'Root/Test/alma' })
            .AddResponse({ d: { Id: 12356, Path: 'Root/Test/alma' } });
        const mockFile = new File(['alma'], 'alma.txt');
        Object.assign(mockFile, {
            size: 8
        });
        testContent.UploadFile({ ContentType: ContentTypes_1.File, File: mockFile, PropertyName: 'Binary', Body: {}, Overwrite: true })
            .subscribe((progress) => { }, (err) => done(err));
    }
    'Upload() failure should trigger ContentCreateFailed event'(done) {
        this._repo.Config.ChunkSize = 1024 * 1024;
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.HttpProviderRef
            .AddError(Error('e'))
            .AddResponse({ d: { Id: 12356, Path: 'Root/Test/alma' } });
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnUploadProgress.subscribe((pi) => {
            done('This shouldn\'t be triggered');
        });
        this._repo.Events.OnContentCreateFailed.subscribe((failure) => {
            done();
        });
        const mockFile = new File(['alma'], 'alma.txt');
        Object.assign(mockFile, {
            size: 8
        });
        testContent.UploadFile({ ContentType: ContentTypes_1.File, File: mockFile, PropertyName: 'Binary', Body: {}, Overwrite: true })
            .subscribe((progress) => { });
    }
    'Upload() chunked content should trigger multiple UploadProgress requests and resolves from Upload observable'(done) {
        this._repo.Config.ChunkSize = 4;
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.HttpProviderRef
            .AddResponse('9865*chunk-token*true*true') // first upload
            .AddResponse({}) // Mocked chunks
            .AddResponse({})
            .AddResponse({})
            .AddResponse({ d: { Id: 12356, Path: 'Root/Test/alma' } }); // Content reload;
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        let uploadReqCount = 0;
        this._repo.Events.OnUploadProgress.subscribe((pi) => {
            uploadReqCount = pi.UploadedChunks;
        }, (err) => done(err), () => {
            expect(uploadReqCount).to.be.eq(3);
            done();
        });
        const mockFile = new File(['alma'], 'alma.txt');
        Object.assign(mockFile, {
            size: 12
        });
        testContent.UploadFile({ ContentType: ContentTypes_1.File, File: mockFile, PropertyName: 'Binary', Body: {}, Overwrite: true })
            .subscribe((progress) => {
            if (progress.Completed) {
                expect(progress.ChunkCount).to.be.eq(progress.UploadedChunks);
                expect(uploadReqCount).to.be.eq(progress.ChunkCount);
                done();
            }
        });
    }
    'Upload() chunked content should trigger multiple UploadProgress requests and resolves from UploadProgress observable'(done) {
        this._repo.Config.ChunkSize = 4;
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.HttpProviderRef
            .AddResponse('9865*chunk-token*true*true') // first upload
            .AddResponse({}) // Mocked chunks
            .AddResponse({})
            .AddResponse({})
            .AddResponse({ d: { Id: 12356, Path: 'Root/Test/alma' } }); // Content reload
        const testContent = this._repo.HandleLoadedContent({ Id: 12345, Path: 'Root/Test', Name: 'task' });
        this._repo.Events.OnUploadProgress.subscribe((progress) => {
            if (progress.Completed) {
                expect(progress.ChunkCount).to.be.eq(progress.UploadedChunks);
                done();
            }
        }, (err) => done(err));
        const mockFile = new File(['alma'], 'alma.txt');
        Object.assign(mockFile, {
            size: 12
        });
        testContent.UploadFile({ ContentType: ContentTypes_1.File, File: mockFile, PropertyName: 'Binary', Body: {}, Overwrite: true })
            .subscribe((progress) => { }, (err) => done(err));
    }
    'UploadTextAsFile should trigger an Upload request'(done) {
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.UploadFile = (...args) => {
            done();
        };
        this._repo.UploadTextAsFile({
            Text: 'alma',
            ContentType: ContentTypes_1.File,
            Overwrite: true,
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd' }),
            PropertyName: 'Binary',
            FileName: 'alma.txt'
        });
    }
    'UploadFromDropEvent should trigger an Upload request w/o webkitRequestFileSystem'(done) {
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.UploadFile = (...args) => {
            done();
            return Observable_1.Observable.of([true]);
        };
        global.window = {};
        const file = new File(['alma.txt'], 'alma');
        Object.assign(file, { type: 'file' });
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    files: [
                        file
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: false,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd' }, ContentTypes_1.Folder)
        });
    }
    'UploadFromDropEvent should trigger an Upload request with webkitRequestFileSystem'(done) {
        this._repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        this._repo.UploadFile = (...args) => {
            done();
            return Observable_1.Observable.of([true]);
        };
        global.window = { webkitRequestFileSystem: () => { } };
        const file = {
            isFile: true,
            file: (cb) => { cb(new File(['alma.txt'], 'alma')); }
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => file }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: false,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd' }, ContentTypes_1.Folder)
        });
    }
    'UploadFromDropEvent should upload a file and distribute proper status info'(done) {
        this._repo.UploadFile = (...args) => {
            return Observable_1.Observable.of({
                ChunkCount: 1,
                Completed: true,
                CreatedContent: { Id: 123456 },
                UploadedChunks: 1
            });
        };
        global.window = { webkitRequestFileSystem: () => { } };
        const file = {
            isFile: true,
            file: (cb) => { cb(new File(['alma.txt'], 'alma')); }
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => file }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: false,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd', Binary: null }, ContentTypes_1.File)
        }).then((result) => {
            done();
        }).catch((err) => done(err));
    }
    'UploadFromDropEvent should distribute an error on upload failure'(done) {
        this._repo.UploadFile = (...args) => {
            const sub = new Subject_1.Subject();
            setTimeout(() => {
                sub.error('erroor');
            }, 10);
            return sub.asObservable;
        };
        global.window = { webkitRequestFileSystem: () => { } };
        const file = {
            isFile: true,
            file: (cb) => { cb(new File(['alma.txt'], 'alma')); }
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => file }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: false,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd', Binary: null }, ContentTypes_1.File)
        }).then((result) => {
            done('This shouldn\'t be called on error');
        }).catch((err) => done());
    }
    'UploadFromDropEvent should distribute an error on file read failure'(done) {
        this._repo.UploadFile = (...args) => {
            return Observable_1.Observable.of({
                ChunkCount: 1,
                Completed: true,
                CreatedContent: { Id: 123456 },
                UploadedChunks: 1
            });
        };
        global.window = { webkitRequestFileSystem: () => { } };
        const file = {
            isFile: true,
            file: (cb, err) => { err('File read fails here...'); }
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => file }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: false,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd', Binary: null }, ContentTypes_1.File)
        }).then((result) => {
            done('This shouldn\'t be called on error');
        }).catch((err) => done());
    }
    'UploadFromDropEvent should create Directories'(done) {
        global.window = { webkitRequestFileSystem: () => { } };
        this._repo.HttpProviderRef.AddResponse({ d: { Id: 123456, Path: 'Root/Folder', Name: 'Example' } });
        this._repo.UploadFile = (...args) => {
            return Observable_1.Observable.of({
                ChunkCount: 1,
                Completed: true,
                CreatedContent: { Id: 123456 },
                UploadedChunks: 1
            });
        };
        const directory = {
            isFile: false,
            isDirectory: true,
            createReader: () => {
                return {
                    readEntries: (cb, err) => {
                        cb([
                            {
                                isFile: true,
                                isDirectory: false,
                                name: 'ExampleDirectory',
                                file: (callback) => { callback(new File(['alma.txt'], 'alma')); }
                            }
                        ]);
                    }
                };
            }
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => directory }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: true,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd', Binary: null }, ContentTypes_1.File)
        }).then((result) => {
            done();
        }).catch((err) => done(err));
    }
    'UploadFromDropEvent should fail on error when creating a folder'(done) {
        global.window = { webkitRequestFileSystem: () => { } };
        this._repo.HttpProviderRef.AddError('neeee');
        this._repo.UploadFile = (...args) => {
            return Observable_1.Observable.of({
                ChunkCount: 1,
                Completed: true,
                CreatedContent: { Id: 123456 },
                UploadedChunks: 1
            });
        };
        const directory = {
            isFile: false,
            isDirectory: true,
        };
        this._repo.UploadFromDropEvent({
            Event: {
                dataTransfer: {
                    items: [
                        { webkitGetAsEntry: () => directory }
                    ]
                }
            },
            Overwrite: true,
            ContentType: ContentTypes_1.File,
            CreateFolders: true,
            PropertyName: 'Binary',
            Parent: this._repo.HandleLoadedContent({ Id: 12379846, Path: '/Root/Text', Name: 'asd' })
        }).then((result) => {
            done('This shouldn\'t be triggered on error');
        }).catch((err) => done());
    }
    'GetCurrentUser() should return an Observable '() {
        const repo = new Mocks_1.MockRepository();
        expect(repo.GetCurrentUser()).to.be.instanceof(Observable_1.Observable);
    }
    'GetCurrentUser() should update with Visitor by default '(done) {
        const repo = new Mocks_1.MockRepository();
        repo.GetCurrentUser().subscribe((u) => {
            expect(u.Name).to.be.eq('Visitor');
            done();
        }, done);
    }
    'GetCurrentUser() should update with the new User on change '(done) {
        const repo = new Mocks_1.MockRepository();
        repo.HttpProviderRef.AddResponse({
            d: {
                __count: 1,
                results: [{
                        Name: 'NewUser',
                        Domain: 'BuiltIn',
                        Id: 1000,
                        LoginName: 'NewUser',
                        Type: 'User',
                    }]
            }
        });
        repo.Authentication.CurrentUser = 'BuiltIn\\NewUser';
        repo.Authentication.StateSubject.next(Authentication_1.LoginState.Pending);
        repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
        repo.GetCurrentUser().subscribe((u) => {
            expect(u.Name).to.be.eq('NewUser');
            done();
        }, done);
    }
    'GetCurrentUser() should not update if multiple users found  on change '(done) {
        const repo = new Mocks_1.MockRepository();
        repo.Authentication.StateSubject.next(Authentication_1.LoginState.Pending);
        repo.Authentication.CurrentUser = 'BuiltIn\\NewUser';
        repo.GetCurrentUser().subscribe((u) => {
            done('Error should be thrown here.');
        }, (err) => {
            expect(err).to.be.eq("Error getting current user: found 2 user(s) with login name 'NewUser' in domain 'BuiltIn'");
            done();
        });
        repo.HttpProviderRef.AddResponse({
            d: {
                __count: 2,
                results: [{
                        Name: 'NewUser',
                        Id: 1000,
                        LoginName: 'NewUser',
                        Domain: 'BuiltIn',
                        Type: 'User',
                    },
                    {
                        Name: 'NewUser',
                        Id: 1000,
                        LoginName: 'NewUser',
                        Domain: 'BuiltIn',
                        Type: 'User',
                    }]
            }
        });
        repo.Authentication.StateSubject.next(Authentication_1.LoginState.Authenticated);
    }
    'SchemaStore should be the generated SchemaStore by default'() {
        const localRepo = new Mocks_1.MockRepository();
        // tslint:disable-next-line:no-string-literal
        expect(localRepo['_schemaStore']).to.be.deep.eq(Schemas_1.SchemaStore);
    }
    'Schould be able to update Schemas with SetSchemas()'() {
        const localRepo = new Mocks_1.MockRepository();
        const newSchemaStore = [{}];
        localRepo.SetSchemas(newSchemaStore);
        // tslint:disable-next-line:no-string-literal
        expect(localRepo['_schemaStore']).to.be.deep.eq(newSchemaStore);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "ODataBaseUrl should return a valid URL based on RepositoryUrl and ODataToken", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetVersionInfo should return a valid Version Info", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetAllContentTypes should be return a valid content type collection", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Load should return a valid Content", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Load should return a valid Content with a valid type, if defined", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "SnRepository should have a default Config, if not provided", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "SnRepository should respect the provided config", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "HandleLoadedContent should respect content type (with fields) from generic", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Content should return an ODataApi instance", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Should be able to create content using repository.CreateContent() ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "DeleteBatch() should fire a DeleteBatch request", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "DeleteBatch() should fire a DeleteBatch request by path", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "DeleteBatch() should trigger ContentDeleted event after success", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "DeleteBatch() should trigger ContentDeleteFailed event on errored operations", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "DeleteBatch() should return error on fail", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "MoveBatch() should fire a MoveBatch request", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "MoveBatch() should trigger ContentMoved event after success", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "MoveBatch() should trigger ContentMoveFailed event after failure", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "MoveBatch() should trigger fail on request error", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "CopyBatch() should fire a CopyBatch request", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "CopyBatch() should trigger ContentCreated event after success", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "CopyBatch() should trigger ContentCreateFailed event after failure", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "CopyBatch() should fail on request error", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadResponse can be constructed", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Upload() should trigger UploadProgress event", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Upload() should trigger ContentCreated event", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Upload() failure should trigger ContentCreateFailed event", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Upload() chunked content should trigger multiple UploadProgress requests and resolves from Upload observable", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Upload() chunked content should trigger multiple UploadProgress requests and resolves from UploadProgress observable", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadTextAsFile should trigger an Upload request", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should trigger an Upload request w/o webkitRequestFileSystem", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should trigger an Upload request with webkitRequestFileSystem", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should upload a file and distribute proper status info", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should distribute an error on upload failure", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should distribute an error on file read failure", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should create Directories", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "UploadFromDropEvent should fail on error when creating a folder", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetCurrentUser() should return an Observable ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetCurrentUser() should update with Visitor by default ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetCurrentUser() should update with the new User on change ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "GetCurrentUser() should not update if multiple users found  on change ", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "SchemaStore should be the generated SchemaStore by default", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RepositoryTests.prototype, "Schould be able to update Schemas with SetSchemas()", null);
RepositoryTests = __decorate([
    mocha_typescript_1.suite('RepositoryTests')
], RepositoryTests);
exports.RepositoryTests = RepositoryTests;
//# sourceMappingURL=RepositoryTests.js.map