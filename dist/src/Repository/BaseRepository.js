"use strict";
/**
 * @module Repository
 */
/** */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Subject_1 = require("rxjs/Subject");
const _1 = require("../Authentication/");
const snconfigmodel_1 = require("../Config/snconfigmodel");
const Content_1 = require("../Content");
const ContentSerializer_1 = require("../ContentSerializer");
const ContentTypes_1 = require("../ContentTypes");
const ODataApi_1 = require("../ODataApi");
const Query_1 = require("../Query");
const Schemas_1 = require("../Schemas");
const SN_1 = require("../SN");
const _2 = require("./");
/**
 *
 */
class BaseRepository {
    /**
     * @param config The Repository's configuration entry
     * @param httpProviderType The type of the Http Provider, should extend HttpProviders.BaseHttpProvider
     * @param authentication The type of the Authentication Service to be used.
     */
    constructor(config, _httpProviderType, authentication) {
        this.Events = new _2.RepositoryEventHub();
        this._loadedContentReferenceCache = new Map();
        /**
         * Shortcut to Content.Create. Creates a new, unsaved Content instance
         * @param {TContentType} options An object with the initial content data
         * @param {{ new(...args: any[]): TContentType }) => Content<TContentType>} contentType The type of the Content instance
         * @returns {Content<TContentType>} the created, unsaved content instance
         */
        this.CreateContent = (options, contentType) => Content_1.ContentInternal.Create(options, contentType, this);
        this._staticContent = {
            VisitorUser: this.HandleLoadedContent({
                Id: 6,
                DisplayName: 'Visitor',
                Domain: 'BuiltIn',
                Name: 'Visitor',
                Path: '/Root/IMS/BuiltIn/Portal/Visitor',
                LoginName: 'Visitor',
                Type: 'User'
            }),
            PortalRoot: this.HandleLoadedContent({
                Id: 2,
                Path: '/Root',
                Name: 'Root',
                DisplayName: 'Root',
                Type: 'PortalRoot'
            })
        };
        /**
         * Creates a Content Query on a Repositoy instance, at Root level (path e.g.: '/OData.svc/Root' )
         * Usage:
         * ```ts
         * const query = repository.CreateQuery(q => q.TypeIs(ContentTypes.Folder)
         *                        .Top(10))
         *
         * query.Exec().subscribe(res => {
         *      console.log('Folders count: ', res.Count);
         *      console.log('Folders: ', res.Result);
         * }
         * ```
         * @returns {Observable<QueryResult<T>>} An observable with the Query result.
         */
        this.CreateQuery = (build, params) => new Query_1.FinializedQuery(build, this, 'Root', params);
        this._currentUserSubject = new BehaviorSubject_1.BehaviorSubject(this._staticContent.VisitorUser);
        this.GetCurrentUser = () => {
            return this._currentUserSubject
                .distinctUntilChanged()
                .filter((u) => {
                const [userDomain, userName] = this.Authentication.CurrentUser.split('\\');
                return u.LoginName === userName && u.Domain === userDomain;
            });
        };
        this._lastKnownUserName = 'BuiltIn\\Visitor';
        this.HttpProviderRef = new _httpProviderType();
        this.Config = new snconfigmodel_1.SnConfigModel(config);
        // warning: Authentication constructor parameterization is not type-safe
        this.Authentication = new authentication(this);
        this._odataApi = new ODataApi_1.ODataApi(this);
        this.initUserUpdate();
    }
    /**
     * Returns the Repository's base OData Url (e.g.: https://demo.sensenet.com/odata.svc)
     */
    // tslint:disable-next-line:naming-convention
    get ODataBaseUrl() {
        return SN_1.ODataHelper.joinPaths(this.Config.RepositoryUrl, this.Config.ODataToken);
    }
    WaitForAuthStateReady() {
        return this.Authentication.State.skipWhile((state) => state === SN_1.Authentication.LoginState.Pending)
            .first();
    }
    /**
     * Public endpoint for making Ajax calls to the Repository
     * @param {string} path The Path for the call
     * @param {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'} method The method type
     * @param {{ new (...args): T }} returnsType The expected return type
     * @param {any} body The post body (optional)
     * @returns {Observable<T>} An observable, which will be updated with the response.
     */
    Ajax(path, method, returnsType, body, additionalHeaders) {
        this.Authentication.CheckForUpdate();
        return this.WaitForAuthStateReady()
            .flatMap((state) => {
            if (!returnsType) {
                returnsType = Object;
            }
            return this.HttpProviderRef.Ajax(returnsType, {
                url: SN_1.ODataHelper.joinPaths(this.ODataBaseUrl, path),
                method,
                body,
                responseType: 'json',
            }, additionalHeaders);
        });
    }
    UploadFile(uploadOptions) {
        this.Authentication.CheckForUpdate();
        uploadOptions.Body = Object.assign({}, uploadOptions.Body, { Overwrite: uploadOptions.Overwrite, PropertyName: uploadOptions.PropertyName, FileName: uploadOptions.File.name, ContentType: uploadOptions.ContentType.name });
        this.Authentication.CheckForUpdate();
        return this.WaitForAuthStateReady()
            .flatMap((state) => {
            const uploadSubject = new Subject_1.Subject();
            const fileName = uploadOptions.File.name;
            const uploadPath = SN_1.ODataHelper.joinPaths(this.ODataBaseUrl, uploadOptions.Parent.GetFullPath(), 'upload');
            if (uploadOptions.File.size <= this.Config.ChunkSize) {
                /** Non-chunked upload */
                uploadOptions.Body.ChunkToken = '0*0*False*False';
                this.HttpProviderRef.Upload((uploadOptions.ContentType), uploadOptions.File, {
                    url: uploadPath,
                    body: uploadOptions.Body,
                })
                    .subscribe((created) => {
                    this.Load(created.Id, uploadOptions.OdataOptions).subscribe((c) => {
                        this.Events.Trigger.ContentCreated({
                            Content: c
                        });
                        const progress = {
                            Completed: true,
                            ChunkCount: 1,
                            UploadedChunks: 1,
                            CreatedContent: c
                        };
                        uploadSubject.next(progress);
                        this.Events.Trigger.UploadProgress(progress);
                        uploadSubject.complete();
                    });
                }, (error) => {
                    this.Events.Trigger.ContentCreateFailed({
                        Content: {
                            Id: null,
                            Path: null,
                            Name: fileName
                        },
                        Error: error
                    });
                    uploadSubject.error(error);
                });
            }
            else {
                /* Chunked upload  */
                /**
                 * Init request
                 */
                const initialChunkData = uploadOptions.File.slice(0, this.Config.ChunkSize);
                return this.HttpProviderRef.Upload(String, new File([initialChunkData], uploadOptions.File.name), {
                    url: uploadPath,
                    body: Object.assign({}, uploadOptions.Body, { UseChunk: true, create: 1 }),
                    headers: {
                        'Content-Range': `bytes ${0}-${this.Config.ChunkSize}/${uploadOptions.File.size}`,
                        'Content-Disposition': `attachment; filename="${uploadOptions.File.name}"`
                    }
                }).
                    flatMap((chunkToken) => {
                    const resp = new _2.UploadResponse(...chunkToken.split('*'));
                    const createdContent = this.HandleLoadedContent({
                        Id: resp.ContentId,
                        Path: uploadOptions.Parent.Path,
                        Name: uploadOptions.File.name,
                        Type: uploadOptions.ContentType.name
                    });
                    this.Events.Trigger.ContentCreated({
                        Content: createdContent
                    });
                    return this.sendChunk(uploadOptions, uploadPath, chunkToken.toString(), resp.ContentId)
                        .flatMap((c) => {
                        return this.Load(resp.ContentId, uploadOptions.OdataOptions)
                            .map((content) => {
                            const chunkCount = Math.ceil(uploadOptions.File.size / this.Config.ChunkSize);
                            // tslint:disable-next-line:no-string-literal
                            content['_isOperationInProgress'] = false;
                            const progressInfo = {
                                Completed: true,
                                ChunkCount: chunkCount,
                                UploadedChunks: chunkCount,
                                CreatedContent: content
                            };
                            this.Events.Trigger.UploadProgress(progressInfo);
                            return progressInfo;
                        });
                    });
                });
            }
            return uploadSubject.asObservable();
        });
    }
    sendChunk(options, uploadPath, chunkToken, contentId, offset = 0) {
        this.Authentication.CheckForUpdate();
        return this.WaitForAuthStateReady()
            .flatMap((state) => {
            let chunkEnd = offset + this.Config.ChunkSize;
            chunkEnd = chunkEnd > options.File.size ? options.File.size : chunkEnd;
            const chunkData = options.File.slice(offset, chunkEnd);
            const request = this.HttpProviderRef.Upload(Object, new File([chunkData], options.File.name), {
                url: uploadPath,
                body: Object.assign({}, options.Body, { UseChunk: true, FileLength: options.File.size, ChunkToken: chunkToken }),
                headers: {
                    'Content-Range': `bytes ${offset}-${chunkEnd - 1}/${options.File.size}`,
                    'Content-Disposition': `attachment; filename="${options.File.name}"`
                }
            }).map((newResp) => {
                const content = this.HandleLoadedContent({
                    Id: contentId,
                    Path: 'asd',
                    Name: options.File.name,
                    Type: options.ContentType.name
                });
                // tslint:disable-next-line:no-string-literal
                content['_isOperationInProgress'] = true;
                const progress = {
                    Completed: false,
                    ChunkCount: Math.ceil(options.File.size / this.Config.ChunkSize),
                    CreatedContent: content,
                    UploadedChunks: (offset / this.Config.ChunkSize) + 1
                };
                this.Events.Trigger.UploadProgress(progress);
                return progress;
            });
            if (chunkEnd === options.File.size) {
                return request;
            }
            return request.flatMap((r) => this.sendChunk(options, uploadPath, chunkToken, contentId, offset + this.Config.ChunkSize));
        });
    }
    UploadTextAsFile(options) {
        const file = new File([options.Text], options.FileName);
        return this.UploadFile(Object.assign({ File: file }, options));
    }
    webkitFileHandler(FileEntry, Scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                FileEntry.file((f) => {
                    Scope.UploadFile(Object.assign({ File: f }, options))
                        .skipWhile((progress) => !progress.Completed)
                        .subscribe((progress) => resolve(progress), (err) => reject(err));
                }, (err) => reject(err));
            });
        });
    }
    webkitDirectoryHandler(Directory, Scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                this.CreateContent({
                    Name: Directory.name,
                    Path: Scope.Path,
                    DisplayName: Directory.name
                }, ContentTypes_1.Folder).Save().subscribe((c) => __awaiter(this, void 0, void 0, function* () {
                    const dirReader = Directory.createReader();
                    yield new Promise((res) => {
                        dirReader.readEntries((items) => __awaiter(this, void 0, void 0, function* () {
                            yield this.webkitItemListHandler(items, c, true, options);
                            res();
                        }));
                    });
                    resolve(c);
                }), (err) => reject(err));
            });
        });
    }
    webkitItemListHandler(items, Scope, CreateFolders, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:forin
            for (const index in items) {
                if (CreateFolders && items[index].isDirectory) {
                    yield this.webkitDirectoryHandler(items[index], Scope, options);
                }
                if (items[index].isFile) {
                    yield this.webkitFileHandler(items[index], Scope, options);
                }
            }
        });
    }
    UploadFromDropEvent(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.webkitRequestFileSystem) {
                const entries = [].map.call(options.Event.dataTransfer.items, (i) => i.webkitGetAsEntry());
                yield this.webkitItemListHandler(entries, options.Parent, options.CreateFolders, options);
            }
            else {
                // Fallback for non-webkit browsers.
                [].forEach.call(options.Event.dataTransfer.files, (f) => __awaiter(this, void 0, void 0, function* () {
                    if (f.type === 'file') {
                        options.Parent.UploadFile(Object.assign({ File: f }, options)).subscribe((c) => { });
                    }
                }));
            }
        });
    }
    /**
     * Reference to the OData API used by the current repository
     */
    get Content() {
        // tslint:disable-next-line:no-console
        console.warn('The property repository.Content is deprecated and will be removed in the near future. Use repositoy.GetODataApi() instead.');
        return this._odataApi;
    }
    // tslint:disable-next-line:naming-convention
    GetODataApi() {
        return this._odataApi;
    }
    /**
     * Gets the complete version information about the core product and the installed applications. This function is accessible only for administrators by default. You can learn more about the
     * subject in the SnAdmin article. You can read detailed description of the function result.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getVersionInfo = GetVersionInfo();
     * getVersionInfo.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetVersionInfo() {
        return this._odataApi.CreateCustomAction({ name: 'GetVersionInfo', path: '/Root', isAction: false }, {}, _2.VersionInfo);
    }
    /**
     * Returns the list of all ContentTypes in the system.
     * @returns {Observable<ODataCollectionResponse<ContentTypes.ContentType>>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getAllContentTypes = GetAllContentTypes();
     * getAllContentTypes.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetAllContentTypes() {
        return this._odataApi.CreateCustomAction({
            name: 'GetAllContentTypes',
            path: '/Root',
            isAction: false
        }, undefined, ODataApi_1.ODataCollectionResponse)
            .map((resp) => {
            return resp.d.results.map((c) => this.HandleLoadedContent(c));
        });
    }
    /**
     * Creates a Content instance that is loaded from the Repository. This method should be used only to instantiate content from payload received from the backend.
     * @param {T & ISavedContent} contentData An object with the Content data
     * @param {new(...args):T} contentType The Content type.
     * @returns {SavedContent<T>}
     * ```ts
     * var content = SenseNet.Content.HandleLoadedContent({ Id: 123456, Path: 'Root/Example', DisplayName: 'My folder' }, ContentTypes.Folder); // content is an instance of the Folder with the DisplayName 'My folder'
     * ```
     */
    HandleLoadedContent(contentData, contentType) {
        let instance;
        const realContentType = (contentType || (contentData.Type && SN_1.ContentTypes[contentData.Type]) || ContentTypes_1.Folder);
        if (contentData.Id) {
            const cached = this._loadedContentReferenceCache.get(contentData.Id);
            if (cached) {
                instance = cached;
                // tslint:disable-next-line:no-string-literal
                instance['updateLastSavedFields'](contentData);
            }
            else {
                instance = Content_1.ContentInternal.Create(contentData, realContentType, this);
                this._loadedContentReferenceCache.set(contentData.Id, instance);
            }
        }
        else {
            instance = Content_1.ContentInternal.Create(contentData, realContentType, this);
        }
        // tslint:disable-next-line:no-string-literal
        instance['_isSaved'] = true;
        this.Events.Trigger.ContentLoaded({ Content: instance });
        return instance;
    }
    /**
     * Requests a Content by the given id.
     * @param idOrPath {number|string} Id of the requested Content.
     * @param version {string} A string containing the version of the requested Content.
     * @param options {Object} JSON object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<T>} Returns an RxJS observable that you can subscribe of in your code.
     * ```ts
     * var content = SenseNet.Content.Load(1234, { expand: 'Avatar' }, 'A.1', ContentTypes.User);
     * content
     *     .map(response => response.d)
     *     .subscribe({
     *        next: response => {
     *            //do something with the response
     *        },
     *        error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *        complete: () => console.log('done'),
     * })
     * ```
     */
    Load(idOrPath, odataOptions, version) {
        const contentURL = typeof idOrPath === 'string' ?
            SN_1.ODataHelper.getContentURLbyPath(idOrPath) :
            SN_1.ODataHelper.getContentUrlbyId(idOrPath);
        const odataRequestOptions = {
            path: contentURL,
            params: odataOptions
        };
        return this._odataApi.Get(odataRequestOptions)
            .share()
            .map((r) => {
            return this.HandleLoadedContent(r.d);
        });
    }
    /**
     * Parses a Content instance from a stringified SerializedContent<T> instance
     * @param stringifiedContent The stringified SerializedContent<T>
     * @throws Error if the Content belongs to another Repository (based it's Origin)
     * @returns The loaded Content
     */
    ParseContent(stringifiedContent) {
        const serializedContent = ContentSerializer_1.ContentSerializer.Parse(stringifiedContent);
        if (serializedContent.Origin.indexOf(this.ODataBaseUrl) !== 0) {
            throw new Error('Content belongs to a different Repository.');
        }
        return this.HandleLoadedContent(serializedContent.Data);
    }
    /**
     * Executes a DeleteBatch request to delete multiple content by a single request.
     *
     * Usage:
     * ```ts
     * repository.DeleteBatch([content1, content2...], true).subscribe(()=>{
     *  console.log('Contents deleted.')
     * })
     * ```
     *
     * @param {(SavedContent | number | string)[]} contentList An array of content to be deleted. Can be a content (with id and/or path), a Path or an Id
     * @param {boolean} permanently Option to delete the content permanently or just move it to the trash
     * @param {Content} rootContent The context node, the PortalRoot by default
     */
    DeleteBatch(contentList, permanent = false, rootContent = this._staticContent.PortalRoot) {
        const action = this._odataApi.CreateCustomAction({
            name: 'DeleteBatch',
            path: rootContent.Path,
            isAction: true,
            requiredParams: ['paths']
        }, {
            data: {
                paths: contentList.map((c) => c.Id || c.Path || c),
                permanent
            }
        });
        action.subscribe((result) => {
            if (result.d.__count) {
                result.d.results.forEach((deleted) => {
                    this.Events.Trigger.ContentDeleted({ ContentData: deleted, Permanently: permanent });
                });
                result.d.errors.forEach((error) => {
                    this.Events.Trigger.ContentDeleteFailed({ Content: this.HandleLoadedContent(error.content), Error: error.error, Permanently: permanent });
                });
            }
        }, (error) => {
            // Whole batch operation failed
        });
        return action;
    }
    /**
     * Executes a MoveBatch request to move multiple content by a single request.
     *
     * Usage:
     * ```ts
     * repository.MoveBatch([content1, content2...], 'Root/NewFolder').subscribe(()=>{
     *  console.log('Contents moved.')
     * })
     * @param {(SavedContent | number | string)[]} contentList An array of content to move. Can be a content (with path) or a Path
     * @param {string} targetPath The target Path
     * @param {Content} rootContent The context node, the PortalRoot by default
     */
    MoveBatch(contentList, targetPath, rootContent = this._staticContent.PortalRoot) {
        const action = this._odataApi.CreateCustomAction({
            name: 'MoveBatch',
            path: rootContent.Path,
            isAction: true,
            requiredParams: ['targetPath', 'paths']
        }, {
            data: [
                {
                    paths: contentList.map((c) => c.Path || c),
                    targetPath
                },
            ]
        });
        action.subscribe((result) => {
            if (result.d.__count) {
                result.d.results.forEach((moved) => {
                    this.Events.Trigger.ContentMoved({
                        From: contentList.find((a) => a.Id === moved.Id).Path,
                        Content: this.HandleLoadedContent(moved),
                        To: targetPath
                    });
                });
                result.d.errors.forEach((error) => {
                    this.Events.Trigger.ContentMoveFailed({
                        From: contentList.find((a) => a.Id === error.content.Id).Path,
                        Content: this.HandleLoadedContent(error.content),
                        To: targetPath,
                        Error: error.error
                    });
                });
            }
        }, (error) => {
            // Whole batch operation failed
        });
        return action;
    }
    /**
     * Executes a CopyBatch request to copy multiple content by a single request.
     *
     * Usage:
     * ```ts
     * repository.CopyBatch([content1, content2...], 'Root/NewFolder').subscribe(()=>{
     *  console.log('Contents copied.')
     * })
     * @param {(SavedContent | number | string)[]} contentList An array of content to copy. Can be a content (with path) or a Path
     * @param {string} targetPath The target Path
     * @param {Content} rootContent The context node, the PortalRoot by default
     */
    CopyBatch(contentList, targetPath, rootContent = this._staticContent.PortalRoot) {
        const action = this._odataApi.CreateCustomAction({
            name: 'CopyBatch',
            path: rootContent.Path,
            isAction: true,
            requiredParams: ['targetPath', 'paths']
        }, {
            data: [
                {
                    paths: contentList.map((c) => c.Path || c),
                    targetPath
                },
            ]
        });
        action.subscribe((result) => {
            if (result.d.__count) {
                result.d.results.forEach((created) => {
                    this.Events.Trigger.ContentCreated({ Content: this.HandleLoadedContent(created) });
                });
                result.d.errors.forEach((error) => {
                    this.Events.Trigger.ContentCreateFailed({ Content: error.content, Error: error.error });
                });
            }
        }, (error) => {
            // Whole batch operation failed
        });
        return action;
    }
    initUserUpdate() {
        this.Authentication.State.skipWhile((state) => state === SN_1.Authentication.LoginState.Pending)
            .subscribe((state) => {
            if (state === _1.LoginState.Unauthenticated) {
                this._currentUserSubject.next(this._staticContent.VisitorUser);
                this._lastKnownUserName = 'BuiltIn\\Visitor';
            }
            else {
                if (this._lastKnownUserName !== this.Authentication.CurrentUser) {
                    const [userDomain, userName] = this.Authentication.CurrentUser.split('\\');
                    this.CreateQuery((q) => q.TypeIs(ContentTypes_1.User)
                        .And
                        .Equals('Domain', userDomain)
                        .And
                        .Equals('LoginName', userName)
                        .Top(1), {
                        select: 'all'
                    }).Exec()
                        .subscribe((usr) => {
                        if (usr.Count === 1) {
                            this._currentUserSubject.next(usr.Result[0]);
                            this._lastKnownUserName = this.Authentication.CurrentUser;
                        }
                        else {
                            this._currentUserSubject.error(`Error getting current user: found ${usr.Count} user(s) with login name '${userName}' in domain '${userDomain}'`);
                        }
                    });
                }
            }
        });
    }
    SetSchemas(newSchemas) {
        this._schemaStore = newSchemas;
        this._schemaCache = new Map();
    }
    /**
     * Returns the Content Type Schema of the given Content Type;
     * @param type {string} The name of the Content Type;
     * @returns {Schemas.Schema}
     * ```ts
     * var genericContentSchema = SenseNet.Content.getSchema(Content);
     * ```
     */
    GetSchema(currentType) {
        return this.GetSchemaByName(currentType.name);
    }
    GetSchemaByName(schemaName) {
        if (!this._schemaCache) {
            this._schemaCache = new Map();
        }
        if (!this._schemaStore) {
            this._schemaStore = Schemas_1.SchemaStore.map((s) => s);
        }
        if (this._schemaCache.has(schemaName)) {
            return Object.assign({}, this._schemaCache.get(schemaName));
        }
        let schema = this._schemaStore.find((s) => s.ContentTypeName === schemaName);
        if (!schema) {
            return this.GetSchema(ContentTypes_1.GenericContent);
        }
        schema = Object.assign({}, schema);
        const parentSchema = schema.ParentTypeName && this.GetSchemaByName(schema.ParentTypeName);
        if (parentSchema) {
            schema.FieldSettings = [...schema.FieldSettings, ...parentSchema.FieldSettings];
        }
        this._schemaCache.set(schemaName, schema);
        return schema;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map