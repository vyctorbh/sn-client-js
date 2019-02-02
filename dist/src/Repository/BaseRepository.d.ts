import { Observable } from 'rxjs/Observable';
import { IAuthenticationService, LoginState } from '../Authentication/';
import { SnConfigModel } from '../Config/snconfigmodel';
import { Content, ContentInternal, IContent, ISavedContent, SavedContent } from '../Content';
import { ContentType, PortalRoot, User } from '../ContentTypes';
import { BaseHttpProvider } from '../HttpProviders';
import { IODataParams, ODataApi, ODataBatchResponse } from '../ODataApi';
import { FinializedQuery, QueryExpression, QuerySegment } from '../Query';
import { Schema } from '../Schemas';
import { RepositoryEventHub, UploadFileOptions, UploadFromEventOptions, UploadProgressInfo, UploadTextOptions, VersionInfo, WithParentContent } from './';
/**
 *
 */
export declare class BaseRepository<TProviderType extends BaseHttpProvider = BaseHttpProvider, TAuthenticationServiceType extends IAuthenticationService = IAuthenticationService> {
    private _odataApi;
    readonly Events: RepositoryEventHub;
    /**
     * Returns the Repository's base OData Url (e.g.: https://demo.sensenet.com/odata.svc)
     */
    readonly ODataBaseUrl: string;
    WaitForAuthStateReady(): Observable<LoginState>;
    /**
     * Public endpoint for making Ajax calls to the Repository
     * @param {string} path The Path for the call
     * @param {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'} method The method type
     * @param {{ new (...args): T }} returnsType The expected return type
     * @param {any} body The post body (optional)
     * @returns {Observable<T>} An observable, which will be updated with the response.
     */
    Ajax<T>(path: string, method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', returnsType?: {
        new (...args: any[]): T;
    }, body?: any, additionalHeaders?: {
        name: string;
        value: string;
    }[]): Observable<T>;
    UploadFile<TFile extends IContent>(uploadOptions: WithParentContent<UploadFileOptions<TFile>>): Observable<UploadProgressInfo<TFile>>;
    private sendChunk<T>(options, uploadPath, chunkToken, contentId, offset?);
    UploadTextAsFile<T extends IContent = IContent>(options: WithParentContent<UploadTextOptions<T>>): Observable<UploadProgressInfo<T>>;
    private webkitFileHandler<T>(FileEntry, Scope, options);
    private webkitDirectoryHandler<T>(Directory, Scope, options);
    private webkitItemListHandler<T>(items, Scope, CreateFolders, options);
    UploadFromDropEvent<T extends IContent = IContent>(options: UploadFromEventOptions<T> & {
        Parent: ContentInternal;
    }): Promise<void>;
    /**
     * Reference to the Http Provider used by the current repository
     */
    readonly HttpProviderRef: TProviderType;
    /**
     * Reference to the OData API used by the current repository
     */
    readonly Content: ODataApi<TProviderType>;
    GetODataApi(): ODataApi<TProviderType>;
    /**
     * Reference to the Authentication Service used by the current repository
     */
    Authentication: TAuthenticationServiceType;
    /**
     * Reference to the configuration used by the current repository
     */
    readonly Config: SnConfigModel;
    /**
     * @param config The Repository's configuration entry
     * @param httpProviderType The type of the Http Provider, should extend HttpProviders.BaseHttpProvider
     * @param authentication The type of the Authentication Service to be used.
     */
    constructor(config: Partial<SnConfigModel>, _httpProviderType: {
        new (): TProviderType;
    }, authentication: {
        new (...args: any[]): TAuthenticationServiceType;
    });
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
    GetVersionInfo(): Observable<VersionInfo>;
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
    GetAllContentTypes(): Observable<ContentType[]>;
    private _loadedContentReferenceCache;
    /**
     * Creates a Content instance that is loaded from the Repository. This method should be used only to instantiate content from payload received from the backend.
     * @param {T & ISavedContent} contentData An object with the Content data
     * @param {new(...args):T} contentType The Content type.
     * @returns {SavedContent<T>}
     * ```ts
     * var content = SenseNet.Content.HandleLoadedContent({ Id: 123456, Path: 'Root/Example', DisplayName: 'My folder' }, ContentTypes.Folder); // content is an instance of the Folder with the DisplayName 'My folder'
     * ```
     */
    HandleLoadedContent<T extends IContent>(contentData: T & ISavedContent, contentType?: {
        new (...args: any[]): T;
    }): SavedContent<T>;
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
    Load<TContentType extends IContent = IContent>(idOrPath: string | number, odataOptions?: IODataParams<TContentType>, version?: string): Observable<SavedContent<TContentType>>;
    /**
     * Shortcut to Content.Create. Creates a new, unsaved Content instance
     * @param {TContentType} options An object with the initial content data
     * @param {{ new(...args: any[]): TContentType }) => Content<TContentType>} contentType The type of the Content instance
     * @returns {Content<TContentType>} the created, unsaved content instance
     */
    CreateContent: <TContentType extends IContent = IContent>(options: TContentType, contentType: {
        new (...args: any[]): TContentType;
    }) => Content<TContentType>;
    /**
     * Parses a Content instance from a stringified SerializedContent<T> instance
     * @param stringifiedContent The stringified SerializedContent<T>
     * @throws Error if the Content belongs to another Repository (based it's Origin)
     * @returns The loaded Content
     */
    ParseContent<T extends Content = Content>(stringifiedContent: string): T;
    private readonly _staticContent;
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
    CreateQuery: <T extends IContent>(build: (first: QueryExpression<T>) => QuerySegment<T>, params?: IODataParams<T> | undefined) => FinializedQuery<T>;
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
    DeleteBatch(contentList: (SavedContent | number | string)[], permanent?: boolean, rootContent?: SavedContent<PortalRoot>): Observable<ODataBatchResponse<ISavedContent>>;
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
    MoveBatch(contentList: (SavedContent | string)[], targetPath: string, rootContent?: Content): Observable<ODataBatchResponse<ISavedContent>>;
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
    CopyBatch(contentList: (SavedContent | string)[], targetPath: string, rootContent?: Content): Observable<ODataBatchResponse<ISavedContent>>;
    private readonly _currentUserSubject;
    GetCurrentUser: () => Observable<SavedContent<User>>;
    private _lastKnownUserName;
    private initUserUpdate();
    private _schemaCache;
    private _schemaStore;
    SetSchemas(newSchemas: Schema[]): void;
    /**
     * Returns the Content Type Schema of the given Content Type;
     * @param type {string} The name of the Content Type;
     * @returns {Schemas.Schema}
     * ```ts
     * var genericContentSchema = SenseNet.Content.getSchema(Content);
     * ```
     */
    GetSchema<TType extends IContent>(currentType: {
        new (...args: any[]): TType;
    }): Schema;
    GetSchemaByName(schemaName: string): Schema;
}
