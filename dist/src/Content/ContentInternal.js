"use strict";
/**
 * @module Content
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const BinaryField_1 = require("../BinaryField");
const ContentReferences_1 = require("../ContentReferences");
const ContentSerializer_1 = require("../ContentSerializer");
const Query_1 = require("../Query");
const SN_1 = require("../SN");
const Types_1 = require("./Types");
/**
 * Internal class representation of a Content instance.
 */
class ContentInternal {
    /**
     * @constructs Content
     * @param {IContentOptions} options An object with the required content data
     * @param {IRepository} repository The Repository instance
     */
    constructor(_options, _repository, _contentType) {
        this._repository = _repository;
        this._contentType = _contentType;
        this._type = this._contentType.name;
        this._isSaved = false;
        this._lastSavedFields = {};
        this._isOperationInProgress = false;
        // private _fieldHandlerCache: (ContentListReferenceField<Content> | ContentReferenceField<Content>)[] = [];
        this._fieldHandlerCache = new Map();
        /**
         * Creates a stringified value from the current Content
         * @returns {string} The stringified value
         */
        this.Stringify = () => ContentSerializer_1.ContentSerializer.Stringify(this.tryGetAsSaved());
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
        this.CreateQuery = (build, params) => {
            if (!this.Path) {
                throw new Error('No Content path provided for querying');
            }
            return new Query_1.FinializedQuery(build, this._repository, this.Path, params);
        };
        Object.assign(this, _options);
        Object.assign(this._lastSavedFields, _options);
        this.updateReferenceFields();
    }
    get _odata() {
        return this._repository.GetODataApi();
    }
    /**
     * Type of the Content, e.g.: 'Task' or 'User'
     */
    get Type() {
        return this._type;
    }
    set Type(newType) {
        this._type = newType;
    }
    /**
     * Indicates if the content is saved into the Repository or is a new Content
     */
    get IsSaved() {
        return this._isSaved;
    }
    /**
     * Returns the assigned Repository instance
     */
    GetRepository() {
        return this._repository;
    }
    updateLastSavedFields(newFields) {
        Object.assign(this._lastSavedFields, newFields);
        this._isSaved = true;
        Object.assign(this, newFields);
        this.updateReferenceFields();
    }
    /**
     * Returns a list about the fields with their values, as they are saved into the Repository
     */
    get SavedFields() {
        return !this.IsSaved ? {} : Object.assign({}, this._lastSavedFields);
    }
    /**
     * Returns a list about the changed fields and their new values
     */
    GetChanges() {
        const changedFields = {};
        for (const field in this.GetFields()) {
            const currentField = this[field];
            if (currentField !== this._lastSavedFields[field]) {
                if (currentField instanceof ContentReferences_1.ContentReferenceField) {
                    if (currentField.IsDirty) {
                        changedFields[field] = currentField.GetValue();
                    }
                }
                else if (currentField instanceof ContentReferences_1.ContentListReferenceField) {
                    if (currentField.IsDirty) {
                        changedFields[field] = currentField.GetValue();
                    }
                }
                else if (currentField instanceof BinaryField_1.BinaryField) {
                    /* skip, binaries cannot be compared */
                }
                else {
                    changedFields[field] = currentField;
                }
            }
        }
        return changedFields;
    }
    /**
     * Returns all Fields based on the Schema, that can be used for API calls (e.g. POSTing a new content)
     */
    GetFields(skipEmpties) {
        const fieldsToPost = {};
        this.GetSchema().FieldSettings.forEach((s) => {
            const fieldName = s.Name;
            let value = this[fieldName];
            if (this[fieldName] && (this[fieldName].GetValue)) {
                value = this[fieldName].GetValue();
            }
            if (this[fieldName] && this[fieldName].GetDownloadUrl) {
                value = this[fieldName].GetDownloadUrl();
            }
            if ((!skipEmpties && value !== undefined) || (skipEmpties && value)) {
                fieldsToPost[fieldName] = value;
            }
        });
        return fieldsToPost;
    }
    /**
     * Shows if the content has been changed on client-side since the last load
     */
    get IsDirty() {
        return Object.keys(this.GetChanges()).length > 0;
    }
    /**
     * Shows if there are any operation in progress
     */
    get IsOperationInProgress() {
        return this._isOperationInProgress;
    }
    /**
     * Indicates that all required fields are filled
     */
    get IsValid() {
        const schema = this.GetSchema();
        const missings = schema.FieldSettings
            .filter((s) => s.Compulsory && !this[s.Name]);
        return missings.length === 0;
    }
    updateReferenceFields() {
        const referenceSettings = this.GetSchema().FieldSettings.filter((f) => SN_1.FieldSettings.isFieldSettingOfType(f, SN_1.FieldSettings.ReferenceFieldSetting));
        referenceSettings.push(...[{ Type: 'ReferenceFieldSetting', Name: 'EffectiveAllowedChildTypes', AllowMultiple: true }, { Type: 'ReferenceFieldSetting', Name: 'AllowedChildTypes', AllowMultiple: true }]);
        referenceSettings.forEach((f) => {
            const fieldName = f.Name;
            if (!this._fieldHandlerCache.has(fieldName)) {
                this._fieldHandlerCache.set(fieldName, f.AllowMultiple ? new ContentReferences_1.ContentListReferenceField(this[fieldName], f, this, this._repository) : new ContentReferences_1.ContentReferenceField(this[fieldName], f, this, this._repository));
            }
            else {
                f.AllowMultiple ?
                    this._fieldHandlerCache.get(fieldName).HandleLoaded(this[fieldName]) :
                    this._fieldHandlerCache.get(fieldName).HandleLoaded(this[fieldName]);
            }
            this[fieldName] = this._fieldHandlerCache.get(fieldName);
        });
        const binarySettings = this.GetSchema().FieldSettings.filter((f) => SN_1.FieldSettings.isFieldSettingOfType(f, SN_1.FieldSettings.BinaryFieldSetting));
        binarySettings.forEach((s) => {
            const fieldName = s.Name;
            if (!(this[fieldName] instanceof BinaryField_1.BinaryField)) {
                const mediaResourceObject = this[fieldName];
                this[fieldName] = new BinaryField_1.BinaryField(mediaResourceObject, this, s);
            }
        });
    }
    tryGetAsSaved() {
        if (Types_1.isSavedContent(this)) {
            return this;
        }
        throw new Error('Content is not saved.');
    }
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
    Delete(permanently) {
        if (this.Id) {
            this._isOperationInProgress = true;
            const fields = this.GetFields();
            const observable = this._odata.Delete(this.Id, permanently);
            observable.subscribe(() => {
                this._repository.Events.Trigger.ContentDeleted({
                    ContentData: fields,
                    Permanently: permanently || false
                });
                this._isOperationInProgress = false;
            }, (err) => {
                this._repository.Events.Trigger.ContentDeleteFailed({
                    Content: this.tryGetAsSaved(),
                    Permanently: permanently || false,
                    Error: err
                });
                this._isOperationInProgress = false;
            });
            return observable;
        }
        return Observable_1.Observable.of(undefined);
    }
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
    Rename(newDisplayName, newName) {
        this._isOperationInProgress = true;
        if (!this.IsSaved) {
            throw new Error('Content is not saved. You can rename only saved content!');
        }
        const fields = {};
        if (newDisplayName) {
            fields.DisplayName = newDisplayName;
        }
        if (newName) {
            fields.Name = newName;
        }
        return this.Save(fields);
    }
    saveContentInternal(fields, override) {
        const originalFields = this.GetFields();
        /** Fields Save logic */
        if (fields) {
            if (!this.Id) {
                const err = new Error('Content Id not present');
                this._repository.Events.Trigger.ContentModificationFailed({
                    Content: this,
                    Fields: fields,
                    Error: err
                });
                throw err;
            }
            if (!this.IsSaved) {
                const err = new Error('The Content is not saved to the Repository, Save it before updating.');
                this._repository.Events.Trigger.ContentModificationFailed({
                    Content: this.tryGetAsSaved(),
                    Fields: fields,
                    Error: err
                });
                throw err;
            }
            if (override) {
                const request = this._odata.Put(this.Id, fields)
                    .map((newFields) => {
                    this.updateLastSavedFields(newFields);
                    this._repository.Events.Trigger.ContentModified({
                        Content: this.tryGetAsSaved(),
                        OriginalFields: originalFields,
                        Changes: fields
                    });
                    return this.tryGetAsSaved();
                }).share();
                request.subscribe(() => { }, (err) => {
                    this._repository.Events.Trigger.ContentModificationFailed({ Content: this.tryGetAsSaved(), Fields: fields, Error: err });
                });
                return request;
            }
            else {
                const request = this._odata.Patch(this.Id, fields)
                    .map((newFields) => {
                    this.updateLastSavedFields(newFields);
                    this._repository.Events.Trigger.ContentModified({ Content: this.tryGetAsSaved(), OriginalFields: originalFields, Changes: fields });
                    return this.tryGetAsSaved();
                }).share();
                request.subscribe(() => { }, (err) => {
                    this._repository.Events.Trigger.ContentModificationFailed({ Content: this.tryGetAsSaved(), Fields: fields, Error: err });
                });
                return request;
            }
        }
        if (!this.IsSaved) {
            // Content not saved, verify Path and POST it
            if (!this.Path) {
                const err = new Error('Cannot create content without a valid Path specified');
                this._repository.Events.Trigger.ContentCreateFailed({ Content: this, Error: err });
                throw err;
            }
            const request = this._odata.Post(this.Path, Object.assign({ Type: this.Type }, this.GetFields(true)))
                .map((resp) => {
                if (!resp.Id) {
                    throw Error('Error: No content Id in response!');
                }
                this._isOperationInProgress = false;
                this.updateLastSavedFields(resp);
                this._repository.HandleLoadedContent(this.tryGetAsSaved());
                this._isSaved = true;
                return this.tryGetAsSaved();
            }).share();
            request.subscribe((c) => {
                this._repository.Events.Trigger.ContentCreated({ Content: c });
            }, (err) => {
                this._repository.Events.Trigger.ContentCreateFailed({ Content: this, Error: err });
            });
            return request;
        }
        else {
            // Content saved
            if (!this.IsDirty) {
                // No changes, no request
                return Observable_1.Observable.of(this.tryGetAsSaved());
            }
            else {
                if (!this.Id) {
                    throw new Error('Content Id not present');
                }
                const changes = this.GetChanges();
                // Patch content
                const request = this._odata.Patch(this.Id, changes)
                    .map((resp) => {
                    this.updateLastSavedFields(resp);
                    return this.tryGetAsSaved();
                }).share();
                request.subscribe(() => {
                    this._repository.Events.Trigger.ContentModified({ Content: this.tryGetAsSaved(), Changes: changes, OriginalFields: originalFields });
                }, (err) => {
                    this._repository.Events.Trigger.ContentModificationFailed({ Content: this.tryGetAsSaved(), Fields: changes, Error: err });
                });
                return request;
            }
        }
    }
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
    Save(fields, override) {
        this._isOperationInProgress = true;
        const saveObservable = this.saveContentInternal(fields, override).share();
        saveObservable.subscribe((success) => {
            success._isOperationInProgress = false;
            this._isOperationInProgress = false;
        }, (err) => {
            this._isOperationInProgress = false;
        });
        return saveObservable;
    }
    /**
     * Reloads every field and reference of the content, based on the specified View from the Schema
     * @throws if the Content is not saved yet or no Id or Path is provided
     * @param {'edit' | 'view'} actionName
     * @returns {Observable<this>} An observable whitch will be updated with the reloaded Content
     */
    Reload(actionName) {
        if (!this.IsSaved) {
            throw new Error('Content has to be saved to reload');
        }
        if (!this.Id && !this.Path) {
            throw new Error('Content Id or Path has to be provided');
        }
        let selectFields = 'all';
        let expandFields;
        if (actionName) {
            const fieldSettings = this.GetSchema().FieldSettings.filter((f) => {
                return actionName === 'edit' && f.VisibleEdit
                    || actionName === 'view' && f.VisibleBrowse;
            });
            selectFields = fieldSettings.map((f) => f.Name);
            expandFields = fieldSettings.filter((f) => SN_1.FieldSettings.isFieldSettingOfType(f, SN_1.FieldSettings.ReferenceFieldSetting))
                .map((f) => f.Name);
        }
        return this._repository.Load(this.Id || this.Path, {
            select: selectFields,
            expand: expandFields
        });
    }
    /**
     * Reloads the specified fields and references of the content
     * @param {(keyof this)[]} fields List of the fields to be loaded
     * @throws if the Content is not saved yet or no Id or Path is provided
     * @returns {Observable<this>} An observable whitch will be updated with the Content
     */
    ReloadFields(...fields) {
        if (!this.IsSaved) {
            throw new Error('Content has to be saved to reload');
        }
        if (!this.Id && !this.Path) {
            throw new Error('Content Id or Path has to be provided');
        }
        const toExpand = this.GetSchema().FieldSettings.filter((f) => fields.indexOf(f.Name) >= 0 && SN_1.FieldSettings.isFieldSettingOfType(f, SN_1.FieldSettings.ReferenceFieldSetting))
            .map((f) => f.Name);
        return this._repository.Load(this.Id || this.Path, {
            select: fields,
            expand: toExpand
        });
    }
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
    Actions(scenario) {
        // tslint:disable-next-line:no-console
        console.warn(`Method 'content.Action() is deprecated' and will be removed. Please use content.GetActions() instead`);
        return this.GetActions(scenario);
    }
    GetActions(scenario) {
        return this._odata.Get({
            path: SN_1.ODataHelper.joinPaths(this.GetFullPath(), 'Actions'),
            params: {
                scenario
            }
        })
            .map((resp) => {
            return resp.d.Actions;
        });
    }
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
    GetAllowedChildTypes(options) {
        return this.AllowedChildTypes.GetContent(options);
    }
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
    GetEffectiveAllowedChildTypes(options) {
        return this.EffectiveAllowedChildTypes.GetContent(options);
    }
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
    GetOwner(options) {
        return this.Owner.GetContent(options);
    }
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
    Creator(options) {
        return this.CreatedBy.GetContent(options);
    }
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
    Modifier(options) {
        return this.ModifiedBy.GetContent(options);
    }
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
    CheckedOutBy(options) {
        return this.CheckedOutTo.GetContent(options);
    }
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
    Children(options) {
        if (!this.Path) {
            throw new Error('No path specified');
        }
        return this._odata.Fetch({
            path: this.Path,
            params: options
        }).map((resp) => {
            return resp.d.results.map((c) => this._repository.HandleLoadedContent(c));
        });
    }
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
    GetVersions(options) {
        return this.Versions.GetContent(options);
    }
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
    GetWorkspace(options) {
        return this.Workspace.GetContent(options);
    }
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
    Checkout() {
        return this._odata.CreateCustomAction({ name: 'CheckOut', id: this.Id, isAction: true });
    }
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
    CheckIn(checkInComments) {
        let action;
        (typeof checkInComments !== 'undefined') ?
            action = { name: 'CheckIn', id: this.Id, isAction: true, params: ['checkInComments'] } :
            action = { name: 'CheckIn', id: this.Id, isAction: true };
        return this._odata.CreateCustomAction(action, { data: { checkInComments: checkInComments ? checkInComments : '' } });
    }
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
    UndoCheckout() {
        return this._odata.CreateCustomAction({ name: 'UndoCheckOut', id: this.Id, isAction: true });
    }
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
    ForceUndoCheckout() {
        return this._odata.CreateCustomAction({ name: 'ForceUndoCheckout', id: this.Id, isAction: true });
    }
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
    Approve() {
        return this._odata.CreateCustomAction({ name: 'Approve', id: this.Id, isAction: true });
    }
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
    Reject(rejectReason) {
        return this._odata.CreateCustomAction({ name: 'Reject', id: this.Id, isAction: true, params: ['rejectReason'] }, { data: { rejectReason: rejectReason ? rejectReason : '' } });
    }
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
    Publish() {
        return this._odata.CreateCustomAction({ name: 'Publish', id: this.Id, isAction: true });
    }
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
    RestoreVersion(version) {
        return this._odata.CreateCustomAction({ name: 'Publish', id: this.Id, isAction: true, requiredParams: ['version'] }, { data: { version: version ? version : '' } });
    }
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
    Restore(destination, newname) {
        return this._odata.CreateCustomAction({ name: 'Restore', id: this.Id, isAction: true, params: ['destination', 'newname'] }, {
            data: {
                destination: destination ? destination : '',
                newname: newname ? newname : ''
            }
        });
    }
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
    MoveTo(toPath) {
        if (!this.IsSaved) {
            throw new Error('Content not saved!');
        }
        if (!this.Path) {
            throw new Error('No Path provided for the content');
        }
        if (!this.Name) {
            throw new Error('No Name provided for the content');
        }
        if (toPath.indexOf(this.Path) === 0) {
            throw new Error('Content cannot be moved below itself');
        }
        const request = this._odata.CreateCustomAction({ name: 'MoveTo', id: this.Id, isAction: true, requiredParams: ['targetPath'] }, { data: { targetPath: toPath } });
        const fromPath = this.Path;
        const newPath = SN_1.ODataHelper.joinPaths(toPath, this.Name);
        request.subscribe((result) => {
            this.Path = newPath;
            this.updateLastSavedFields({ Path: newPath });
            this._repository.Events.Trigger.ContentMoved({
                Content: this.tryGetAsSaved(),
                From: fromPath,
                To: toPath
            });
        }, (err) => {
            this._repository.Events.Trigger.ContentMoveFailed({
                Content: this.tryGetAsSaved(),
                From: fromPath,
                To: toPath,
                Error: err
            });
        });
        return request;
    }
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
    CopyTo(path) {
        return this._odata.CreateCustomAction({ name: 'CopyTo', id: this.Id, isAction: true, requiredParams: ['targetPath'] }, { data: { targetPath: path } });
    }
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
    AddAllowedChildTypes(contentTypes) {
        return this._odata.CreateCustomAction({ name: 'AddAllowedChildTypes', id: this.Id, isAction: true, requiredParams: ['contentTypes'] }, { data: { contentTypes } });
    }
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
    RemoveAllowedChildTypes(contentTypes) {
        return this._odata.CreateCustomAction({ name: 'RemoveAllowedChildTypes', id: this.Id, isAction: true, requiredParams: ['contentTypes'] }, { data: { contentTypes } });
    }
    /**
     * Returns the Content Type Schema of the Content.
     * @returns {Schemas.Schema} Array of fieldsettings.
     * ```ts
     * let schema = SenseNet.Content.GetSchema(Content);
     * ```
     */
    GetSchema() {
        return this._repository.GetSchema(this._contentType);
    }
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
    static Create(options, newContent, repository) {
        const created = new ContentInternal(options, repository, newContent);
        if (newContent) {
            created.Type = newContent.name;
        }
        return created;
    }
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
    SetPermissions(arg) {
        if (arg instanceof Array) {
            return this._odata.CreateCustomAction({ name: 'SetPermissions', id: this.Id, isAction: true, requiredParams: ['entryList'] }, { data: { entryList: arg } });
        }
        else {
            return this._odata.CreateCustomAction({ name: 'SetPermissions', path: this.Path, isAction: true, requiredParams: ['inheritance'] }, { data: { inheritance: arg } });
        }
    }
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
    GetPermission(identity) {
        return this._odata.CreateCustomAction({ name: 'GetPermission', id: this.Id, isAction: false, params: ['identity'] }, { data: { identity: identity ? identity : '' } });
    }
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
    HasPermission(permissions, identity) {
        let params = `permissions=${permissions.join(',')}`;
        if (identity && identity.Path) {
            params += `&identity=${identity.Path}`;
        }
        return this._repository.Ajax(`${this.GetFullPath()}/HasPermission?${params}`, 'GET');
    }
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
    TakeOwnership(userOrGroup) {
        return this._odata.CreateCustomAction({ name: 'TakeOwnership', id: this.Id, isAction: true, params: ['userOrGroup'] }, { data: { userOrGroup: userOrGroup ? userOrGroup : '' } });
    }
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
    SaveQuery(query, displayName, queryType) {
        return this._odata.CreateCustomAction({ name: 'SaveQuery', id: this.Id, isAction: true, requiredParams: ['query', 'displayName', 'queryType'] }, { data: { query, displayName: displayName ? displayName : '', queryType } });
    }
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
    GetQueries(onlyPublic = true) {
        return this._odata.CreateCustomAction({ name: 'GetQueries', id: this.Id, isAction: false, noCache: true, requiredParams: ['onlyPublic'] }, { data: { onlyPublic } });
    }
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
    Finalize() {
        return this._odata.CreateCustomAction({ name: 'FinalizeContent', id: this.Id, isAction: true });
    }
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
    TakeLockOver(userId) {
        return this._odata.CreateCustomAction({ name: 'TakeLockOver', id: this.Id, isAction: true, params: ['user'] }, { data: { user: userId ? userId : '' } });
    }
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
    RebuildIndex(recursive, rebuildLevel) {
        return this._odata.CreateCustomAction({ name: 'RebuildIndex', id: this.Id, isAction: true, params: ['recursive', 'rebuildLevel'] }, { data: { recursive: recursive ? recursive : false, rebuildLevel: rebuildLevel ? rebuildLevel : 0 } });
    }
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
    RebuildIndexSubtree() {
        return this._odata.CreateCustomAction({ name: 'RebuildIndexSubtree', id: this.Id, isAction: true });
    }
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
    RefreshIndexSubtree() {
        return this._odata.CreateCustomAction({ name: 'RefreshIndexSubtree', id: this.Id, isAction: true });
    }
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
    CheckPreviews(generateMissing) {
        return this._odata.CreateCustomAction({ name: 'CheckPreviews', id: this.Id, isAction: true, params: ['generateMissing'] }, { data: { generateMissing: generateMissing ? generateMissing : false } });
    }
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
    RegeneratePreviews() {
        return this._odata.CreateCustomAction({ name: 'RegeneratePreviews', id: this.Id, isAction: true });
    }
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
    GetPageCount() {
        return this._odata.CreateCustomAction({ name: 'GetPageCount', id: this.Id, isAction: true });
    }
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
    PreviewAvailable(page) {
        return this._odata.CreateCustomAction({ name: 'PreviewAvailable', id: this.Id, isAction: false, requiredParams: ['page'] }, { data: { page } });
    }
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
    // tslint:disable-next-line:naming-convention
    GetPreviewImagesForOData() {
        return this._odata.CreateCustomAction({ name: 'GetPreviewImagesForOData', id: this.Id, isAction: false });
    }
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
    // tslint:disable-next-line:naming-convention
    GetExistingPreviewImagesForOData() {
        return this._odata.CreateCustomAction({ name: 'GetExistingPreviewImagesForOData', id: this.Id, isAction: false });
    }
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
    // tslint:disable-next-line:naming-convention
    GetAllowedChildTypesFromCTD() {
        return this._odata.CreateCustomAction({ name: 'GetAllowedChildTypesFromCTD', id: this.Id, isAction: false });
    }
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
    GetRelatedIdentities(level, kind) {
        return this._odata.CreateCustomAction({ name: 'GetRelatedIdentities', id: this.Id, isAction: true, requiredParams: ['level', 'kind'] }, { data: { level, kind } });
    }
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
    GetRelatedPermissions(level, explicitOnly, member, includedTypes) {
        return this._odata.CreateCustomAction({ name: 'GetRelatedPermissions', id: this.Id, isAction: true, requiredParams: ['level', 'explicitOnly', 'member', 'includedTypes'] }, { data: { level, explicitOnly, member, includedTypes } });
    }
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
    GetRelatedItems(level, explicitOnly, member, permissions) {
        return this._odata.CreateCustomAction({ name: 'GetRelatedItems', id: this.Id, isAction: true, requiredParams: ['level', 'explicitOnly', 'member', 'permissions'] }, { data: { level, explicitOnly, member, permissions } });
    }
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
    GetRelatedIdentitiesByPermissions(level, kind, permissions) {
        return this._odata.CreateCustomAction({ name: 'GetRelatedIdentitiesByPermissions', id: this.Id, isAction: true, requiredParams: ['level', 'kind', 'permissions'] }, { data: { level, kind, permissions } });
    }
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
    GetRelatedItemsOneLevel(level, member, permissions) {
        return this._odata.CreateCustomAction({ name: 'GetRelatedItemsOneLevel', id: this.Id, isAction: true, requiredParams: ['level', 'member', 'permissions'] }, { data: { level, member, permissions } });
    }
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
    GetAllowedUsers(permissions) {
        return this._odata.CreateCustomAction({ name: 'GetAllowedUsers', id: this.Id, isAction: true, requiredParams: ['permissions'] }, { data: { permissions } });
    }
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
    GetParentGroups(directOnly) {
        return this._odata.CreateCustomAction({ name: 'GetParentGroups', id: this.Id, isAction: true, requiredParams: ['directOnly'] }, { data: { directOnly } });
    }
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
    AddMembers(contentIds) {
        return this._odata.CreateCustomAction({ name: 'AddMembers', id: this.Id, isAction: true, requiredParams: ['contentIds'] }, { data: { contentIds } });
    }
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
    RemoveMembers(contentIds) {
        return this._odata.CreateCustomAction({ name: 'RemoveMembers', id: this.Id, isAction: true, requiredParams: ['contentIds'] }, { data: { contentIds } });
    }
    /**
     * Uploads a File into a level below the specified Content
     * @param {UploadFileOptions<T>} uploadOptions The options to the Upload request
     */
    UploadFile(uploadOptions) {
        return this._repository.UploadFile(Object.assign({}, uploadOptions, { Parent: (this.tryGetAsSaved()) }));
    }
    /**
     * Creates and uploads a text file from a string value into a level below the specified Content
     * @param {UploadTextOptions<T>} uploadOptions The options to the Upload request
     */
    UploadText(uploadOptions) {
        const Parent = this.tryGetAsSaved();
        return this._repository.UploadTextAsFile(Object.assign({}, uploadOptions, { Parent }));
    }
    /**
     * Uploads multiple files / folders from a single Drop event into a level below a specified content
     * @param {UploadFromEventOptions<T>} uploadOptions The options to the Upload request
     */
    UploadFromDropEvent(uploadOptions) {
        const Parent = this.tryGetAsSaved();
        return this._repository.UploadFromDropEvent(Object.assign({}, uploadOptions, { Parent }));
    }
    /**
     * Returns the parent content's Path in a Collection format
     * e.g. for the 'Child' content '/Root/Parent/Child' you will get '/Root/Parent'
     * @throws if no Path is specified or the content is not saved yet.
     */
    get ParentPath() {
        if (!this.Path) {
            throw Error('No Path provided for the Content');
        }
        if (!this.IsSaved) {
            throw Error('Content has to be saved to retrieve the ParentPath');
        }
        const segments = this.Path.split('/');
        segments.pop();
        return segments.join('/');
    }
    /**
     * Returns the parent content's Path in an Entity format
     * e.g. for the 'Child' content '/Root/Parent/Child' you will get '/Root/('Parent')'
     */
    get ParentContentPath() {
        return SN_1.ODataHelper.getContentURLbyPath(this.ParentPath);
    }
    /**
     * Indicates if the current Content is the parent a specified Content
     */
    IsParentOf(childContent) {
        return this._repository === childContent.GetRepository() && this.IsSaved &&
            (this.Id && childContent.ParentId === this.Id
                || childContent.ParentPath === this.Path);
    }
    /**
     * Indicates if the current Content is a child of a specified Content
     */
    IsChildOf(parentContent) {
        return this._repository === parentContent.GetRepository() && parentContent.IsSaved &&
            (parentContent.Id && this.ParentId === parentContent.Id
                || this.ParentPath === parentContent.Path);
    }
    /**
     * Indicates if the current Content is an ancestor of a specified Content
     */
    IsAncestorOf(descendantContent) {
        if (!descendantContent.Path || !this.Path) {
            throw Error('No path provided');
        }
        return this._repository === descendantContent.GetRepository() && this.IsSaved && descendantContent.Path.indexOf(this.Path + '/') === 0;
    }
    /**
     * Indicates if the current Content is a descendant of a specified Content
     */
    IsDescendantOf(ancestorContent) {
        if (!ancestorContent.Path || !this.Path) {
            throw Error('No path provided');
        }
        return this._repository === ancestorContent.GetRepository() && ancestorContent.IsSaved && this.Path.indexOf(ancestorContent.Path + '/') === 0;
    }
    /**
     * Returns the full Path for the current content
     * @throws if the Content is not saved yet, or hasn't got an Id or Path defined
     */
    GetFullPath() {
        if (!this.IsSaved) {
            throw new Error('Content has to be saved to get the full Path');
        }
        if (this.Id) {
            return SN_1.ODataHelper.getContentUrlbyId(this.Id);
        }
        else if (this.Path) {
            return SN_1.ODataHelper.getContentURLbyPath(this.Path);
        }
        else {
            throw new Error('Content Id or Path has to be provided to get the full Path');
        }
    }
}
exports.ContentInternal = ContentInternal;
//# sourceMappingURL=ContentInternal.js.map