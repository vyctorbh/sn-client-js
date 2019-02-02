"use strict";
/**
 * @module Content
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const Content_1 = require("./Content");
const ODataHelper_1 = require("./ODataHelper");
const Query_1 = require("./Query");
const SN_1 = require("./SN");
class ReferenceAbstract {
    constructor() {
        this._isDirty = false;
    }
    get IsDirty() {
        return this._isDirty;
    }
    /**
     * Executes a search query to lookup possible values to the reference field
     * @param { string } term This term will be searched in the _Text field
     * @param { number } top The Top value for paging
     * @param { number } skip The Skip value for paging
     * @param { IOdataParams } odataParams The additional OData params (like select, expand, etc...)
     * @returns { FinializedQuery } The FinializedQuery instance that can be executed
     *
     * Example:
     * ```ts
     * reference.Search('Term').Exec().subscribe(hits=>{
     *      console.log(hits);
     * });
     * ```
     */
    Search(term, top = 10, skip = 0, odataParams = {}) {
        return new Query_1.FinializedQuery((q) => {
            let query = q.Equals('_Text', `*${term}*`);
            if (this.FieldSetting.SelectionRoots && this.FieldSetting.SelectionRoots.length) {
                query = query.And.Query((innerTree) => {
                    this.FieldSetting.SelectionRoots && this.FieldSetting.SelectionRoots.forEach((root, index, thisArray) => {
                        innerTree = innerTree.InTree(root);
                        if (index < thisArray.length - 1) {
                            innerTree = innerTree.Or;
                        }
                    });
                    return innerTree;
                });
            }
            if (this.FieldSetting.AllowedTypes && this.FieldSetting.AllowedTypes.length) {
                const foundTypes = this.FieldSetting.AllowedTypes.map((type) => SN_1.ContentTypes[type]).filter((a) => a !== undefined);
                if (foundTypes.length > 0) {
                    query = query.And.Query((innerTypes) => {
                        foundTypes.forEach((type, index, thisArray) => {
                            innerTypes = innerTypes.Type(type);
                            if (index < thisArray.length - 1) {
                                innerTypes = innerTypes.Or;
                            }
                        });
                        return innerTypes;
                    });
                }
            }
            return query.Top(top).Skip(skip);
        }, this.Repository, '/Root', odataParams);
    }
}
exports.ReferenceAbstract = ReferenceAbstract;
/**
 * Represents a Reference field on a Content object. Example:
 * ```ts
 * let myTask = repository.Load('/Root/MyTasks/Task1', {expand: ['Owner']}).subscribe(task => {
 *     task.Owner.GetContent(owner => {
 *         console.log('The Owner of the task is:', owner.DisplayName);
 *     })
 * }, error => console.error)
 * ```
 *
 */
class ContentReferenceField extends ReferenceAbstract {
    constructor(fieldData, FieldSetting, _ownerContent, Repository) {
        super();
        this.FieldSetting = FieldSetting;
        this._ownerContent = _ownerContent;
        this.Repository = Repository;
        this.HandleLoaded(fieldData);
    }
    /**
     * Updates the reference value to another Content
     * @param {T} content The new Content value
     */
    SetContent(content) {
        this._contentReference = content;
        this._isDirty = true;
    }
    /**
     * Gets the current reference value.
     * @param {ODataParams} odataOptions Additional options to select/expand/etc...
     * @returns {Observable<T>} An observable that will publish the referenced content
     */
    GetContent(odataOptions) {
        if (!this._ownerContent.IsSaved || this._contentReference !== undefined) {
            return Observable_1.Observable.of(this._contentReference);
        }
        const request = this.Repository.GetODataApi().Get({
            path: this._referenceUrl || ODataHelper_1.joinPaths(this._ownerContent.GetFullPath(), this.FieldSetting.Name),
            params: odataOptions
        })
            .map((r) => {
            return r && r.d && this.Repository.HandleLoadedContent(r.d);
        }).share();
        request.subscribe((c) => {
            this._contentReference = c;
        });
        return request;
    }
    /**
     * @returns The reference value (content Path) that can be used for change tracking and content updates.
     */
    GetValue() {
        return this._contentReference && this._contentReference.Path;
    }
    /**
     * Updates the reference URL in case of DeferredObject (not-expanded-fields) or populates the Content reference (for expanded fields) from an OData response's Field
     * @param {DeferredObject | T['options']} fieldData The DeferredObject or ContentOptions data that can be used
     */
    HandleLoaded(fieldData) {
        if (Content_1.isDeferred(fieldData)) {
            this._referenceUrl = fieldData.__deferred.uri.replace(this.Repository.Config.ODataToken, '');
        }
        else if (Content_1.isIContent(fieldData)) {
            this._contentReference = this.Repository.HandleLoadedContent(fieldData);
        }
        this._isDirty = false;
    }
}
exports.ContentReferenceField = ContentReferenceField;
/**
 * Represents a Reference list field on a Content object. Example:
 * ```ts
 * let myTask = repository.Load('/Root/MyTasks/Task1', {expand: ['Versions']}).subscribe(versions => {
 *     task.Versions.GetContent(versions => {
 *         console.log('The available versions are:', versions);
 *     })
 * }, error => console.error)
 * ```
 *
 */
class ContentListReferenceField extends ReferenceAbstract {
    constructor(fieldData, FieldSetting, _ownerContent, Repository) {
        super();
        this.FieldSetting = FieldSetting;
        this._ownerContent = _ownerContent;
        this.Repository = Repository;
        this.HandleLoaded(fieldData);
    }
    /**
     * Updates the reference list to another Content list
     * @param {T[]} content The new list of content
     */
    SetContent(content) {
        this._contentReferences = content;
        this._isDirty = true;
    }
    /**
     * Gets the current referenced values.
     * @param {ODataParams} odataOptions Additional options to select/expand/etc...
     * @returns {Observable<T[]>} An observable that will publish the list of the referenced content
     */
    GetContent(odataOptions) {
        if (!this._ownerContent.IsSaved || this._contentReferences) {
            return Observable_1.Observable.of(this._contentReferences);
        }
        //
        const request = this.Repository.GetODataApi().Fetch({
            path: this._referenceUrl || ODataHelper_1.joinPaths(this._ownerContent.GetFullPath(), this.FieldSetting.Name),
            params: odataOptions
        }).map((resp) => {
            return resp && resp.d && resp.d.results.map((c) => this.Repository.HandleLoadedContent(c)) || [];
        }).share();
        request.subscribe((c) => {
            this._contentReferences = c;
        });
        return request;
    }
    /**
     * @returns The reference value (content Path list) that can be used for change tracking and content updates.
     */
    GetValue() {
        return this._contentReferences && this._contentReferences
            .filter((c) => c.Path && c.Path.length)
            .map((c) => c.Path);
    }
    /**
     * Updates the reference URL in case of DeferredObject (not-expanded-fields) or populates the Content list references (for expanded fields) from an OData response's field
     * @param {DeferredObject | T['options'][]} fieldData The DeferredObject or ContentOptions data that can be used
     */
    HandleLoaded(fieldData) {
        if (Content_1.isDeferred(fieldData)) {
            this._referenceUrl = fieldData.__deferred.uri.replace(this.Repository.Config.ODataToken, '');
        }
        else if (SN_1.isIContentList(fieldData)) {
            this._contentReferences = fieldData.map((f) => this.Repository.HandleLoadedContent(f));
        }
        this._isDirty = false;
    }
}
exports.ContentListReferenceField = ContentListReferenceField;
//# sourceMappingURL=ContentReferences.js.map