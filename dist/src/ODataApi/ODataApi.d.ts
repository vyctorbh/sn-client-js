/**
 * @module ODataApi
 */ /** */
import { Observable } from 'rxjs/Observable';
import { IContent, ISavedContent, SavedContent } from '../Content';
import { BaseHttpProvider } from '../HttpProviders';
import { BaseRepository } from '../Repository/BaseRepository';
import { ICustomActionOptions, IODataParams, IODataRequestOptions, ODataCollectionResponse, ODataResponse } from './';
/**
 * This class contains methods and classes for sending requests and getting responses from the Content Repository through OData REST API.
 *
 * Following methods return Rxjs Observables which are made from the ajax requests' promises. Action methods like Delete or Rename on Content calls this methods,
 * gets their responses as Observables and returns them so that you can subscribe them in your code.
 */
export declare class ODataApi<THttpProvider extends BaseHttpProvider> {
    private readonly _repository;
    /**
     * The HTTP provider instance for making AJAX calls.
     */
    /**
     * @param {BaseRepository} repository Reference to a Repository instance
     */
    constructor(_repository: BaseRepository<THttpProvider>);
    /**
     * Method to get a Content from the Content Repository through OData REST API.
     *
     * @param {ODataRequestOptions} options Object with the params of the ajax request.
     * @param {new(...args): T} returns The content type that will be returned
     * @returns {Observable} Returns an Rxjs observable that you can subscribe of in your code.
     *
     * ```ts
     * myODataApi.Get(new ODataApi.ODataRequestOptions({
     *      path: 'Root/Sites/Default_site/todos'
     *      }), ContentTypes.TaskList)
     *     .subscribe(result=>{
     *          console.log('My TaskList is:', result.d)
     *      });
     * ```
     */
    Get<T extends IContent>(options: IODataRequestOptions<T>): Observable<ODataResponse<T & ISavedContent>>;
    /**
     * Method to fetch children of a Content from the Content Repository through OData REST API.
     *
     * This method creates an Observable, sends an ajax request to the server and convert the reponse to promise which will be the argument of the Observable.
     * @params options {ODataRequestOptions} Object with the params of the ajax request.
     * @returns {Observable} Returns an Rxjs observable that you can subscribe of in your code.
     *
     * ```ts
     * myODataApi.Fetch(new ODataApi.ODataRequestOptions({
     *       path: 'Root/Sites/Default_site/todos'
     *       }), ContentTypes.Task)
     *   .subscribe(result=>{
     *      console.log('Tasks count:', result.d.__count);
     *      console.log('The Tasks are:', result.d.results);
     *   });
     * ```
     */
    Fetch<T extends IContent = IContent>(options: IODataRequestOptions<T>): Observable<ODataCollectionResponse<T & ISavedContent>>;
    /**
     * Method to post a created content into the sense NET Content Repoository.
     * @param {string} path The Path of the content
     * @param {T} content The options (fields) for the content to be created.
     * @param { new(opt, repository):T } postedContentType The type of the content
     * @param {IRepository} repository The repository for the content creation
     * @returns {Observable<T>} An observable whitch will be updated with the created content.
     *
     * ```ts
     *  const myTask = new ContentTypes.Task({
     *       Name: 'My New Task',
     *       DueDate: new Date(),
     *  }, myRepository)
     *
     *  myODataApi.Post('Root/Sites/Default_site/todos', myTask, ContentTypes.Task)
     *  .subscribe(result=>{
     *      console.log('My New Task is:', result);
     *  });
     * ```
     */
    Post<T extends IContent>(path: string, contentBody: T): Observable<SavedContent<T>>;
    /**
     * Method to delete a Content from the Content Repository through OData REST API.
     *
     * @param {number} id Id of the Content that will be deleted.
     * @param {number} permanentc Determines whether the Content should be moved to the Trash or be deleted permanently.
     * @returns {Observable} Returns an observable that you can subscribe of in your code.
     */
    Delete: (id: number, permanent?: boolean | undefined) => Observable<any>;
    /**
     * Method to modify a single or multiple fields of a Content through OData REST API.
     *
     * @param {number} id Id of the Content that will be modified.
     * @param {{new(...args): T}} contentType The type of the content
     * @param {Partial<T['options']>} fields Contains the modifiable fieldnames as keys and their values.
     * @returns {Observable} Returns an Rxjs observable that you can subscribe of in your code.
     *
     * ```ts
     * myODataApi.Patch(3, ContentTypes.Task, {
     *       Name: 'MyUpdatedTask'
     *  })
     * .subscribe(result=>{
     *      console.log('My Updated Task is:', result);
     * });
     * ```
     */
    Patch<T extends IContent>(id: number, fields: T): Observable<T & ISavedContent>;
    /**
     * Method to set multiple fields of a Content and clear the rest through OData REST API.
     *
     * This method creates an Observable, sends an ajax request to the server and convert the reponse to promise which will be the argument of the Observable.
     * @param {number} id Id of the Content that will be modified.
     * @param {{new(...args): T}} contentType The type of the content
     * @param {T['options']} fields Contains the modifiable fieldnames as keys and their values.
     * @returns {Observable} Returns an Rxjs observable that you can subscribe of in your code.
     *
     * ```ts
     * myODataApi.Put(3, ContentTypes.Task, {
     *       Name: 'MyUpdatedTask'
     *  })
     * .subscribe(result=>{
     *      console.log('My Updated Task is:', result);
     * });
     * ```
     */
    Put<T extends IContent>(id: number, fields: T): Observable<SavedContent<T>>;
    /**
     * Creates a wrapper function for a callable custom OData action.
     *
     * This method creates an Observable, sends an ajax request to the server and convert the reponse to promise which will be the argument of the Observable.
     * @param {ICustomActionOptions} actionOptions A CustomAction configuration object.
     * @param {IODataParams} options An object that holds the config of the ajax request like urlparameters or data.
     * @param {new(...args): TReturnType} returns Th type that the action should return
     * @returns {Observable<TReturnType>} Returns an Rxjs observable whitch will be resolved with TReturnType that you can subscribe of in your code.
     */
    CreateCustomAction<TReturnType>(actionOptions: ICustomActionOptions, options?: IODataParams<any>, returns?: {
        new (...args: any[]): TReturnType;
    }): Observable<TReturnType>;
}
