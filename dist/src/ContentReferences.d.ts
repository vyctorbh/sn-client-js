/**
 * @module Content
 */ /** */
import { Observable } from 'rxjs/Observable';
import { DeferredObject } from './ComplexTypes';
import { IContent, SavedContent } from './Content';
import { ReferenceFieldSetting } from './FieldSettings';
import { IODataParams } from './ODataApi/ODataParams';
import { FinializedQuery } from './Query';
import { BaseRepository } from './Repository/BaseRepository';
export declare abstract class ReferenceAbstract<T extends IContent> {
    readonly abstract FieldSetting: ReferenceFieldSetting;
    readonly abstract Repository: BaseRepository;
    protected _isDirty: boolean;
    readonly IsDirty: boolean;
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
    Search(term: string, top?: number, skip?: number, odataParams?: IODataParams<T>): FinializedQuery<T>;
}
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
export declare class ContentReferenceField<T extends IContent> extends ReferenceAbstract<T> {
    readonly FieldSetting: ReferenceFieldSetting;
    private readonly _ownerContent;
    readonly Repository: BaseRepository;
    private _contentReference;
    private _referenceUrl;
    /**
     * Updates the reference value to another Content
     * @param {T} content The new Content value
     */
    SetContent(content: SavedContent<T>): void;
    /**
     * Gets the current reference value.
     * @param {ODataParams} odataOptions Additional options to select/expand/etc...
     * @returns {Observable<T>} An observable that will publish the referenced content
     */
    GetContent(odataOptions?: IODataParams<T>): Observable<SavedContent<T>>;
    /**
     * @returns The reference value (content Path) that can be used for change tracking and content updates.
     */
    GetValue(): string | undefined;
    /**
     * Updates the reference URL in case of DeferredObject (not-expanded-fields) or populates the Content reference (for expanded fields) from an OData response's Field
     * @param {DeferredObject | T['options']} fieldData The DeferredObject or ContentOptions data that can be used
     */
    HandleLoaded(fieldData: DeferredObject | SavedContent<T>): void;
    constructor(fieldData: DeferredObject | SavedContent<T>, FieldSetting: ReferenceFieldSetting, _ownerContent: SavedContent, Repository: BaseRepository);
}
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
export declare class ContentListReferenceField<T extends IContent> extends ReferenceAbstract<T> {
    readonly FieldSetting: ReferenceFieldSetting;
    private readonly _ownerContent;
    readonly Repository: BaseRepository;
    private _contentReferences;
    private _referenceUrl;
    /**
     * Updates the reference list to another Content list
     * @param {T[]} content The new list of content
     */
    SetContent(content: SavedContent<T>[]): void;
    /**
     * Gets the current referenced values.
     * @param {ODataParams} odataOptions Additional options to select/expand/etc...
     * @returns {Observable<T[]>} An observable that will publish the list of the referenced content
     */
    GetContent(odataOptions?: IODataParams<T>): Observable<SavedContent<T>[]>;
    /**
     * @returns The reference value (content Path list) that can be used for change tracking and content updates.
     */
    GetValue(): string[] | undefined;
    /**
     * Updates the reference URL in case of DeferredObject (not-expanded-fields) or populates the Content list references (for expanded fields) from an OData response's field
     * @param {DeferredObject | T['options'][]} fieldData The DeferredObject or ContentOptions data that can be used
     */
    HandleLoaded(fieldData: DeferredObject | T[]): void;
    constructor(fieldData: DeferredObject | T[], FieldSetting: ReferenceFieldSetting, _ownerContent: SavedContent, Repository: BaseRepository);
}
