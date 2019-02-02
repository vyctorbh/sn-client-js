/**
 * @module Content
 */ /** */
import { Observable } from 'rxjs/Observable';
import { ContentListReferenceField, ContentReferenceField } from '../ContentReferences';
import { ContentType, Group, User, Workspace } from '../ContentTypes';
import { IODataParams } from '../ODataApi';
import { FinializedQuery, QueryExpression, QuerySegment } from '../Query';
import { ActionModel } from '../Repository/ActionModel';
import { BaseRepository } from '../Repository/BaseRepository';
import { UploadFileOptions, UploadFromEventOptions, UploadProgressInfo, UploadTextOptions } from '../Repository/UploadModels';
import { ContentTypes, Enums, Schemas, Security } from '../SN';
import { IContent } from './IContent';
import { ISavedContent } from './ISavedContent';
import { Content, SavedContent } from './Types';
/**
 * Internal class representation of a Content instance.
 */
export declare class ContentInternal<T extends IContent = IContent> {
    private _repository;
    private readonly _contentType;
    private readonly _odata;
    private _type;
    /**
     * Type of the Content, e.g.: 'Task' or 'User'
     */
    Type: string;
    Id?: number;
    Path?: string;
    Name?: string;
    ParentId?: number;
    Versions: ContentListReferenceField<T>;
    Workspace: ContentReferenceField<Workspace>;
    Owner: ContentReferenceField<User>;
    CreatedBy: ContentReferenceField<User>;
    ModifiedBy: ContentReferenceField<User>;
    CheckedOutTo: ContentReferenceField<User>;
    EffectiveAllowedChildTypes: ContentListReferenceField<ContentType>;
    AllowedChildTypes: ContentListReferenceField<ContentType>;
    private _isSaved;
    /**
     * Indicates if the content is saved into the Repository or is a new Content
     */
    readonly IsSaved: boolean;
    /**
     * Returns the assigned Repository instance
     */
    GetRepository(): BaseRepository;
    private _lastSavedFields;
    protected updateLastSavedFields(newFields: T): void;
    /**
     * Returns a list about the fields with their values, as they are saved into the Repository
     */
    readonly SavedFields: T;
    /**
     * Returns a list about the changed fields and their new values
     */
    GetChanges(): T;
    /**
     * Returns all Fields based on the Schema, that can be used for API calls (e.g. POSTing a new content)
     */
    GetFields(skipEmpties?: boolean): T;
    /**
     * Shows if the content has been changed on client-side since the last load
     */
    readonly IsDirty: boolean;
    private _isOperationInProgress;
    /**
     * Shows if there are any operation in progress
     */
    readonly IsOperationInProgress: boolean;
    /**
     * Indicates that all required fields are filled
     */
    readonly IsValid: boolean;
    private _fieldHandlerCache;
    private updateReferenceFields();
    private tryGetAsSaved();
    /**
     * @constructs Content
     * @param {IContentOptions} options An object with the required content data
     * @param {IRepository} repository The Repository instance
     */
    constructor(_options: T, _repository: BaseRepository, _contentType: {
        new (...args: any[]): T;
    });
    /**
     * Deletes a content item from the Content Repository (by default the Content is moved to the Trash).
     * @param permanently {boolean} Determines if the Content should be deleted permanently or moved to the Trash.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.Delete(false)
     *      subscribe( response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error));
     * ```
     */
    Delete(permanently?: boolean): Observable<void>;
    /**
     * Modifies the DisplayName or the DisplayName and the Name of a content item in the Content Repository.
     * @param {string} newDisplayNameNew display name of the content.
     * @param {string} newName New name of the content.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.Rename('New Title')
     *        .subscribe(response => {
     *            console.log(response);
     *        }, error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    Rename(newDisplayName: string, newName?: string): Observable<SavedContent<T>>;
    private saveContentInternal(fields?, override?);
    /**
     * Saves the content with its given modified fields to the Content Repository.
     * @param {T?} fields Optional - The fields to be saved. If not provided, the changed fields will be saved
     * @param {boolean? } override Determines whether clear the fields that are not given (true) or leave them and modify only the given fields (false).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     *  //Set Index field's value to 2 and clear the rest of the fields.
     * content.Save({'Index':2}, true)
     *        .subscribe(response => {
     *            console.log(response);
     *        },
     *        error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     *
     * // Update the Description field only
     * content.Description = 'New description text';
     * content.Save() //Set Index field's value to 2 and clear the rest of the fields.
     *        .subscribe(response => {
     *            console.log(response);
     *        },
     *        error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    Save(fields?: T, override?: boolean): Observable<SavedContent<T>>;
    /**
     * Reloads every field and reference of the content, based on the specified View from the Schema
     * @throws if the Content is not saved yet or no Id or Path is provided
     * @param {'edit' | 'view'} actionName
     * @returns {Observable<this>} An observable whitch will be updated with the reloaded Content
     */
    Reload(actionName?: 'edit' | 'view'): Observable<SavedContent<T>>;
    /**
     * Reloads the specified fields and references of the content
     * @param {(keyof this)[]} fields List of the fields to be loaded
     * @throws if the Content is not saved yet or no Id or Path is provided
     * @returns {Observable<this>} An observable whitch will be updated with the Content
     */
    ReloadFields(...fields: (keyof T)[]): Observable<SavedContent<T>>;
    /**
     * Method that returns actions of a content.
     * @param {string} scenario
     * @returns {Observable<ActionModel[]>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.GetActions('ListItem')
     *   .subscribe(response => {
     *        console.log(response);
     *    },
     *    error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    Actions(scenario?: string): Observable<ActionModel[]>;
    GetActions(scenario?: string): Observable<ActionModel[]>;
    /**
     * Method that returns allowed child type list of a content.
     * @param {IODataParams<ContentType>} options {Object} JSON object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent<ContentType>[]>} Returns an RxJS observable with the content types of the allowed child types
     * ```
     * content.GetAllowedChildTypes()
     *   .subscribe({
     *       response => {
     *         console.log(response);
     *       },
     *       error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    GetAllowedChildTypes(options?: IODataParams<ContentType>): Observable<SavedContent<ContentType>[]>;
    /**
     * Method that returns effective allowed child type list of a content.
     * @param {IODataParams<ContentType>} options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.GetEffectiveAllowedChildTypes()
     *   .subscribe({
     *       response => {
     *         console.log(response);
     *       },
     *       error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    GetEffectiveAllowedChildTypes(options?: IODataParams<ContentType>): Observable<(ContentType & ISavedContent)[]>;
    /**
     * Method that returns owner of a content.
     * @param {IODataParams<ContentType>} options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {ObservableSavedContent<User>} an observable that will be updated with the Owner user.
     * ```
     * content.GetOwner({select: ['FullName']})
     *      .subscribe(
     *          response => {
     *              console.log(response);
     *          },
     *          error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    GetOwner(options?: IODataParams<ContentTypes.User>): Observable<SavedContent<User>>;
    /**
     * Method that returns creator of a content.
     * @param {IODataParams<User>} options JSON object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent<User>>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.Creator({select: ['FullName']})
     *      .subscribe(
     *          response => {
     *              console.log(response);
     *          },
     *          error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    Creator(options?: IODataParams<User>): Observable<SavedContent<User>>;
    /**
     * Method that returns last modifier of a content.
     * @param {IODataParams<User>} options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent<User>>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.Modifier({select: ['FullName']})
     *      .subscribe(
     *          response => {
     *              console.log(response);
     *          },
     *          error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    Modifier(options?: IODataParams<User>): Observable<SavedContent<User>>;
    /**
     * Method that returns the user who checked-out the content.
     * @param {IODataParams<User>} options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent<User>>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * content.CheckedOutBy({select: ['FullName']})
     *      .subscribe(
     *          response => {
     *              console.log(response);
     *          },
     *          error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value));
     * ```
     */
    CheckedOutBy(options?: IODataParams<User>): Observable<SavedContent<User>>;
    /**
     * Method that returns the children of a content.
     *
     * Calls the method [FetchContent]{@link ODataApi.FetchContent} with the content id and the given OData options.
     * If you leave the options undefined only the Id and the Type fields will be in the response. These two fields are always the part of the reponse whether they're added or not to the options
     * as selectable.
     * @param { IODataParams<Content> } options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent[]>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let children = content.Children({select: ['DisplayName']});
     * children.subscribe({
     *  next: response => {
     *      console.log(response);
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Children(options?: IODataParams<Content>): Observable<SavedContent[]>;
    /**
     * Returns the list of versions.
     *
     * Calls the method [GetContent]{@link ODataApi.GetContent} with the content id and the given OData options.
     * If you leave the options undefined only the Id and the Type fields will be in the response. These two fields are always the part of the reponse whether they're added or not to the options
     * as selectable.
     * @param {IODataParams<T>} options {Object} JSON object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable<SavedContent<T>[]>} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let versions = content.GetVersions();
     * versions.subscribe({
     *  next: response => {
     *      console.log(response);
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetVersions(options?: IODataParams<T>): Observable<SavedContent<T>[]>;
    /**
     * Returns the current Workspace.
     *
     * Calls the method [GetContent]{@link ODataApi.GetContent} with the content id and the given OData options.
     * If you leave the options undefined only the Id and the Type fields will be in the response. These two fields are always the part of the reponse whether they're added or not to the options
     * as selectable.
     * @param {IODataParams<Workspace>} options Object with the possible ODATA parameters like select, expand, etc.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let currentWorkspace = content.GetWorkspace();
     * currentWorkspace.subscribe({
     *  next: response => {
     *      console.log(response);
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetWorkspace(options?: IODataParams<Workspace>): Observable<SavedContent<Workspace>>;
    /**
     * Checkouts a content item in the Content Repository.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let checkoutContent = content.Checkout();
     * checkoutContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Checkout(): Observable<{}>;
    /**
     * Checkins a content item in the Content Repository.
     * @params checkInComments {string=}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let checkinContent = content.Checkin();
     * checkinContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    CheckIn(checkInComments?: string): Observable<{}>;
    /**
     * Performs an undo check out operation on a content item in the Content Repository.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let undoCheckoutContent = content.UndoCheckout();
     * undoCheckoutContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    UndoCheckout(): Observable<{}>;
    /**
     * Performs a force undo check out operation on a content item in the Content Repository.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let forceUndoCheckoutContent = content.ForceUndoCheckout();
     * forceUndoCheckoutContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    ForceUndoCheckout(): Observable<{}>;
    /**
     * Performs an approve operation on a content, the equivalent of calling Approve() on the Content instance in .NET. Also checks whether the content handler of the subject content
     * inherits GenericContent (otherwise it does not support this operation). This action has no parameters.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let approveContent = content.Approve();
     * approveContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Approve(): Observable<{}>;
    /**
     * Performs a reject operation on a content, the equivalent of calling Reject() on the Content instance in .NET. Also checks whether the content handler
     * of the subject content inherits GenericContent (otherwise it does not support this operation). The reject reason can be supplied in an optional parameter called rejectReason.
     * @params rejectReason {string}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let rejectContent = content.Reject();
     * rejectContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Reject(rejectReason?: string): Observable<{}>;
    /**
     * Performs a publish operation on a content, the equivalent of calling Publish() on the Content instance in .NET. Also checks whether the content handler of the subject content
     * inherits GenericContent (otherwise it does not support this operation). This action has no parameters.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let publishContent = content.Publish();
     * publishContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Publish(): Observable<{}>;
    /**
     * Restores an old version of the content. Also checks whether the content handler of the subject content inherits GenericContent (otherwise it does not support this operation).
     * This action has a single parameter called version where the caller can specify which old version to restore.
     * @params version {string} Old version to restore.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let restoreVersion = content.RestoreVersion();
     * restoreVersion.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RestoreVersion(version: string): Observable<{}>;
    /**
     * Restores a deleted content from the Trash. You can call this action only on a TrashBag content that contains the deleted content itself.
     * @params destination {string=} Path of the target container, where the deleted content will be restored. If it is not provided, the system uses the original path stored on the trash bag content.
     * @params newname {boolean=} whether to generate a new name automatically if a content with the same name already exists in the desired container (e.g. mydocument(1).docx).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let restoreContent = content.Restore();
     * restoreContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Restore(destination?: string, newname?: boolean): Observable<{}>;
    /**
     * Copies one content to another container by a given path.
     * @params Path {string}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let moveContent = content.MoveTo('/Root/Sites/Default_Site/NewsDemo/Internal');
     * moveContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    MoveTo(toPath: string): Observable<{}>;
    /**
     * Copies one content to another container by a given path.
     * @params Path {string}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let copyContent = content.CopyTo('/Root/Sites/Default_Site/NewsDemo/Internal');
     * copyContent.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    CopyTo(path: string): Observable<{}>;
    /**
     * Adds the given content types to the Allowed content Type list.
     * @params contentTypes {string[]} A list of the case sensitive content type names.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let setAllowedChildTypes = content.AddAllowedChildTypes(['Folder','ContentList']]);
     * setAllowedChildTypes.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    AddAllowedChildTypes(contentTypes: string[]): Observable<{}>;
    /**
     * Removes the given content types from the Allowed content Type list. If the list after removing and the list on the matching CTD are the same, the local list will be removed.
     * @params contentTypes {string[]} A list of the case sensitive content type names.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let removeAllowedChildTypes = content.RemoveAllowedChildTypes(['Folder','ContentList']]);
     * removeAllowedChildTypes.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RemoveAllowedChildTypes(contentTypes: string[]): Observable<{}>;
    /**
     * Returns the Content Type Schema of the Content.
     * @returns {Schemas.Schema} Array of fieldsettings.
     * ```ts
     * let schema = SenseNet.Content.GetSchema(Content);
     * ```
     */
    GetSchema(): Schemas.Schema;
    /**
     * Creates a Content object by the given type and options Object that hold the field values.
     * @param {T} options Object for initial fields and values
     * @param {new(...args: any[]): T} newContent The Content Type definition
     * @param {BaseRepository} repository the Repository instance
     * @returns {SenseNet.Content}
     * ```ts
     * var content = SenseNet.Content.Create({ DisplayName: 'My folder' }, ContentTypes.Folder); // content is an instance of the ContentTypes.Folder with the DisplayName 'My folder'
     * ```
     */
    static Create<T extends IContent = IContent>(options: T, newContent: {
        new (...args: any[]): T;
    }, repository: BaseRepository): Content<T>;
    /**
     * Sets permissions on the requested content. You can add or remove permissions for one ore more users or groups using this action or even break/unbreak permission inheritance.
     * @param identities {Security.PermissionRequestBody[]} Permission entry list: array of permission entry objects, containing an identity Id or Path and one or more permission
     * settings for permission types (see examples below).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let myPermissionRequestBody = new Security.PermissionRequestBody[
     *       {identity:"/Root/IMS/BuiltIn/Portal/Visitor", OpenMinor:"allow", Save:"deny"},
     *       {identity:"/Root/IMS/BuiltIn/Portal/Creators", Custom16:"A", Custom17:"1"}
     * ];
     * let setPermissions = content.SetPermissions(myPermissionRequestBody);
     * setPermissions.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    /**
     * Sets permissions on the requested content. You can add or remove permissions for one ore more users or groups using this action or even break/unbreak permission inheritance.
     * @param inheritance {Security.Inheritance} inheritance: break or unbreak
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let setPermissions = content.SetPermissions({inheritance:"break"});
     * setPermissions.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    SetPermissions(arg: Security.Inheritance | Security.PermissionRequestBody[]): Observable<{}>;
    /**
     * Gets permissions for the requested content. If no identity is given, all the permission entries will be returned.
     *
     * Required permissions to call this action: See permissions.
     * @params identity {string=} path of the identity whose permissions must be returned (user, group or organizational unit)
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getPermissions = content.GetPermission('/Root/Sites/Default_Site/workspaces/Project/budapestprojectworkspace/Groups/Members');
     * getPermissions.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetPermission(identity?: string): Observable<{}>;
    /**
     * Gets if the given user (or if it is not given than the current user) has the specified permissions for the requested content.
     *
     * Required permissions to call this action: See permissions.
     * @params permissions {string[]} list of permission names (e.g. Open, Save)
     * @params user {string} [CurrentUser] path of the user
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let hasPermission = content.HasPermission(['AddNew', 'Save']);
     * hasPermission.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    HasPermission(permissions: ('See' | 'Preview' | 'PreviewWithoutWatermark' | 'PreviewWithoutRedaction' | 'Open' | 'OpenMinor' | 'Save' | 'Publish' | 'ForceCheckin' | 'AddNew' | 'Approve' | 'Delete' | 'RecallOldVersion' | 'DeleteOldVersion' | 'SeePermissions' | 'SetPermissions' | 'RunApplication' | 'ManageListsAndWorkspaces' | 'TakeOwnership' | 'Custom01' | 'Custom02' | 'Custom03' | 'Custom04' | 'Custom05' | 'Custom06' | 'Custom07' | 'Custom08' | 'Custom09' | 'Custom10' | 'Custom11' | 'Custom12' | 'Custom13' | 'Custom14' | 'Custom15' | 'Custom16' | 'Custom17' | 'Custom18' | 'Custom19' | 'Custom20' | 'Custom21' | 'Custom22' | 'Custom23' | 'Custom24' | 'Custom25' | 'Custom26' | 'Custom27' | 'Custom28' | 'Custom29' | 'Custom30' | 'Custom31' | 'Custom32')[], identity?: User | Group): Observable<boolean>;
    /**
     * Users who have TakeOwnership permission for the current content can modify the Owner of this content.
     * @params userOrGroup {string} path or the id of the new owner (that can be a Group or a User). The input parameter also supports empty or null string,
     * in this case the new owner will be the current user.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let takeOwnerShip = content.TakeOwnership({'userGroup':'/Root/IMS/BuiltIn/Portal/Admin'});
     * takeOwnerShip.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    TakeOwnership(userOrGroup?: string): Observable<{}>;
    /**
     * Creates or modifies a {Query} content. Use this action instead of creating query content directly using the basic OData create method, because query content can be saved
     * under a workspace or to the user's profile as a private query.
     * @params query {string} Query text, composed in Query Builder or written manually (see Query syntax for more details).
     * @params displayName {string} Desired display name for the query content. Can be empty.
     * @params queryType {ComplexTypes.SavedQueryType} [Public] Type of the saved query. If an empty value is posted, the default is Public.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let saveQuery = content.SaveQuery({
     *    'query':'DisplayName:Africa',
     *    'displayName': 'My query',
     *    'queryType': 'Private'
     * });
     * saveQuery.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    SaveQuery(query: string, displayName: string, queryType: Enums.QueryType): Observable<{}>;
    /**
     * Gets Query content that are relevant in the current context. The result set will contain two types of content:
     * * Public queries: query content in the Queries content list of the current workspace.
     * * Private queries: query content in the Queries content list under the profile of the current user
     * @params onlyPublic {boolean} if true, only public queries are returned from the current workspace.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getQueries = content.GetQueries(true);
     * getQueries.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetQueries(onlyPublic?: boolean): Observable<{}>;
    /**
     * Closes a Multistep saving operation and sets the saving state of a content to Finalized. Can be invoked only on content that are not already finalized.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let finalize = content.FinalizeContent(true);
     * finalize.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    Finalize(): Observable<{}>;
    /**
     * Lets administrators take over the lock of a checked out document from another user. A new locker user can be provided using the 'user' parameter (user path or id as string).
     * If left empty, the current user will take the lock.
     * @params userId {number=}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let takeLockOver = content.TakeLockOver(true);
     * takeLockOver.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    TakeLockOver(userId?: number): Observable<{}>;
    /**
     * These actions perform an indexing operation on a single content or a whole subtree.
     * @params recursive {boolean=}
     * @params rebuildLevel {number=}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let rebuildIndex = content.RebuildIndex(true);
     * rebuildIndex.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RebuildIndex(recursive?: boolean, rebuildLevel?: number): Observable<{}>;
    /**
     * Performs a full reindex operation on the content and the whole subtree.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let rebuildIndexSubtree = content.RebuildIndexSubtree();
     * rebuildIndexSubtree.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RebuildIndexSubtree(): Observable<{}>;
    /**
     * Refreshes the index document of the content and the whole subtree using the already existing index data stored in the database.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let refreshIndexSubtree = content.RefreshIndexSubtree();
     * refreshIndexSubtree.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RefreshIndexSubtree(): Observable<{}>;
    /**
     * Returns the number of currently existing preview images. If necessary, it can make sure that all preview images are generated and available for a document.
     * @ params generateMissing {boolean=}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let checkPreviews = content.CheckPreviews(true);
     * checkPreviews.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    CheckPreviews(generateMissing?: boolean): Observable<{}>;
    /**
     * It clears all existing preview images for a document and starts a task for generating new ones. This can be useful in case the preview status of a document has been set to 'error'
     * before for some reason and you need to force the system to re-generate preview images.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let regeneratePreviews = content.RegeneratePreviews();
     * regeneratePreviews.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RegeneratePreviews(): Observable<{}>;
    /**
     * Returns the number of pages in a document. If there is no information about page count on the content, it starts a preview generation task to determine the page count.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getPageCount = content.GetPageCount();
     * getPageCount.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetPageCount(): Observable<{}>;
    /**
     * Gets information about a preview image generated for a specific page in a document. It returns with the path and the dimensions (width/height) of the image. If the image does not exist yet,
     * it returns with an empty object but it starts a background task to generate that image if a valid page count number was determined'’’. If page count is -1 you need to call GetPageCount action
     * first. It is OK to call this method periodically for checking if an image is already available.
     * @params page {number}
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let previewAvailable = content.PreviewAvailable(2);
     * previewAvailable.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    PreviewAvailable(page: number): Observable<{}>;
    /**
     * Returns the full list of preview images as content items. This method synchronously generates all missing preview images.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getPreviewImagesForOData = content.GetPreviewImagesForOData();
     * getPreviewImagesForOData.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetPreviewImagesForOData(): Observable<{}>;
    /**
     * Returns the list of existing preview images (only the first consecutive batch) as objects with a few information (image path, dimensions). It does not generate any new images.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getExistingPreviewImagesForOData = content.GetExistingPreviewImagesForOData();
     * getExistingPreviewImagesForOData.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetExistingPreviewImagesForOData(): Observable<{}>;
    /**
     * Returns the list of the AllowedChildTypes which are set on the current Content.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getAllowedChildTypesFromCTD = content.GetAllowedChildTypesFromCTD();
     * getAllowedChildTypesFromCTD.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetAllowedChildTypesFromCTD(): Observable<{}>;
    /**
     * Identity list that contains every users/groups/organizational units that have any permission setting (according to permission level) in the subtree of the context content.
     * @params level {Security.PermissionLevel}  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @params kind {Security.IdentityKind} The value can be: All, Users, Groups, OrganizationalUnits, UsersAndGroups, UsersAndOrganizationalUnits, GroupsAndOrganizationalUnits
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getRelatedIdentities = content.GetRelatedIdentities("AllowedOrDenied", "Groups");
     * getRelatedIdentities.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetRelatedIdentities(level: Security.PermissionLevel, kind: Security.IdentityKind): Observable<{}>;
    /**
     * Permission list of the selected identity with the count of related content. 0 indicates that this permission has no related content so the GUI does not have to display it as a tree node
     * @params level {Security.PermissionLevel}  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @params explicitOnly {boolean} The value "true" is required because "false" is not implemented yet.
     * @params member {string} Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @params includedTypes {string[]} An item can increment the counters if its type or any ancestor type is found in the 'includedTypes'. Null means filtering off. If the array is empty, there
     * is no element that increases the counters. This filter can reduce the execution speed dramatically so do not use if it is possible.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getRelatedPermissions = content.GetRelatedPermissions("AllowedOrDenied", true, "/Root/IMS/BuiltIn/Portal/EveryOne", null);
     * getRelatedPermissions.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetRelatedPermissions(level: Security.PermissionLevel, explicitOnly: boolean, member: string, includedTypes?: string[]): Observable<{}>;
    /**
     * Content list that have explicite/effective permission setting for the selected user in the current subtree.
     * @params level {Security.PermissionLevel}  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @params explicitOnly {boolean} The value "true" is required because "false" is not implemented yet.
     * @params member {string} Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @params permissions {string[]} related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getRelatedItems = content.GetRelatedItems("AllowedOrDenied", true, "/Root/IMS/BuiltIn/Portal/EveryOne", ["RunApplication"]);
     * getRelatedItems.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetRelatedItems(level: Security.PermissionLevel, explicitOnly: boolean, member: string, permissions: string[]): Observable<{}>;
    /**
     * This structure is designed for getting tree of content that are permitted or denied for groups/organizational units in the selected subtree. The result content are not in a paged list:
     * they are organized in a tree.
     * @params level {Security.PermissionLevel}  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @params kind {Security.IdentityKind} The value can be: All, Users, Groups, OrganizationalUnits, UsersAndGroups, UsersAndOrganizationalUnits, GroupsAndOrganizationalUnits
     * @params permissions {string[]} related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getRelatedIdentitiesByPermissions = content.GetRelatedIdentitiesByPermissions("AllowedOrDenied", "Groups", ["RunApplication"]);
     * getRelatedIdentitiesByPermissions.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetRelatedIdentitiesByPermissions(level: Security.PermissionLevel, kind: Security.IdentityKind, permissions: string[]): Observable<{}>;
    /**
     * This structure is designed for getting tree of content that are permitted or denied for groups/organizational units in the selected subtree. The result content are not in a paged list:
     * they are organized in a tree.
     * @params level {Security.PermissionLevel}  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @params member {string} Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @params permissions {string[]} related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getRelatedItemsOneLevel = content.GetRelatedItemsOneLevel("AllowedOrDenied", "/Root/IMS/BuiltIn/Portal/Visitor", ["Open", "RunApplication"]);
     * getRelatedItemsOneLevel.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetRelatedItemsOneLevel(level: Security.PermissionLevel, member: string, permissions: string[]): Observable<{}>;
    /**
     * Returns a content collection that represents users who have enough permissions to a requested resource. The permissions effect on the user and through direct or indirect group membership
     * too. The function parameter is a permission name list that must contain at least one item.
     * @params permissions {string[]} related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getAllowedUsers = content.GetAllowedUsers(["Open", "RunApplication"]);
     * getAllowedUsers.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetAllowedUsers(permissions: string[]): Observable<{}>;
    /**
     * Returns a content collection that represents groups where the given user or group is member directly or indirectly. This function can be used only on a resource content that is
     * Group or User or any inherited type. If the value of the "directOnly" parameter is false, all indirect members are listed.
     * @params directOnly {boolean} If the value of the "directOnly" parameter is false, all indirect members are listed.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let getParentGroups = content.GetParentGroups(["Open", "RunApplication"]);
     * getParentGroups.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    GetParentGroups(directOnly: boolean): Observable<{}>;
    /**
     * Administrators can add new members to a group using this action. The list of new members can be provided using the 'contentIds' parameter (list of user or group ids).
     * @params contentIds {number[]} List of the member ids.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let addMembers = content.AddMembers([ 123, 456, 789 ]);
     * addMembers.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    AddMembers(contentIds: number[]): Observable<{}>;
    /**
     * Administrators can remove members from a group using this action. The list of removable members can be provided using the 'contentIds' parameter (list of user or group ids).
     * @params contentIds {number[]} List of the member ids.
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     * ```
     * let removeMembers = content.RemoveMembers([ 123, 456, 789 ]);
     * removeMembers.subscribe({
     *  next: response => {
     *      console.log('success');
     *  },
     *  error: error => console.error('something wrong occurred: ' + error.responseJSON.error.message.value),
     *  complete: () => console.log('done'),
     * });
     * ```
     */
    RemoveMembers(contentIds: number[]): Observable<{}>;
    /**
     * Uploads a File into a level below the specified Content
     * @param {UploadFileOptions<T>} uploadOptions The options to the Upload request
     */
    UploadFile<TFileType extends IContent>(uploadOptions: UploadFileOptions<TFileType>): Observable<UploadProgressInfo<TFileType>>;
    /**
     * Creates and uploads a text file from a string value into a level below the specified Content
     * @param {UploadTextOptions<T>} uploadOptions The options to the Upload request
     */
    UploadText<TFileType extends IContent>(uploadOptions: UploadTextOptions<TFileType>): Observable<UploadProgressInfo<TFileType>>;
    /**
     * Uploads multiple files / folders from a single Drop event into a level below a specified content
     * @param {UploadFromEventOptions<T>} uploadOptions The options to the Upload request
     */
    UploadFromDropEvent<TFileType extends Content>(uploadOptions: UploadFromEventOptions<TFileType>): Promise<void>;
    /**
     * Returns the parent content's Path in a Collection format
     * e.g. for the 'Child' content '/Root/Parent/Child' you will get '/Root/Parent'
     * @throws if no Path is specified or the content is not saved yet.
     */
    readonly ParentPath: string;
    /**
     * Returns the parent content's Path in an Entity format
     * e.g. for the 'Child' content '/Root/Parent/Child' you will get '/Root/('Parent')'
     */
    readonly ParentContentPath: string;
    /**
     * Indicates if the current Content is the parent a specified Content
     */
    IsParentOf(childContent: SavedContent): boolean;
    /**
     * Indicates if the current Content is a child of a specified Content
     */
    IsChildOf(parentContent: SavedContent): boolean;
    /**
     * Indicates if the current Content is an ancestor of a specified Content
     */
    IsAncestorOf(descendantContent: SavedContent): boolean;
    /**
     * Indicates if the current Content is a descendant of a specified Content
     */
    IsDescendantOf(ancestorContent: SavedContent): boolean;
    /**
     * Returns the full Path for the current content
     * @throws if the Content is not saved yet, or hasn't got an Id or Path defined
     */
    GetFullPath(): string;
    /**
     * Creates a stringified value from the current Content
     * @returns {string} The stringified value
     */
    Stringify: () => string;
    /**
     * Creates a content query on a Content instance.
     * Usage:
     * ```ts
     * const query = content.CreateQuery(q => q.TypeIs(ContentTypes.Folder)
     *                        .Top(10))
     * query.Exec().subscribe(res => {
     *      console.log('Folders count: ', res.Count);
     *      console.log('Folders: ', res.Result);
     * }
     *
     * ```
     * @returns {Observable<QueryResult<T>>} An observable with the Query result.
     */
    CreateQuery: <TContentType extends IContent = IContent>(build: (first: QueryExpression<Content>) => QuerySegment<TContentType>, params?: IODataParams<TContentType>) => FinializedQuery<TContentType>;
}
