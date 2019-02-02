/**
 * @module Query
 */ /** */
import { Observable } from 'rxjs/Observable';
import { QueryExpression, QueryResult, QuerySegment } from '.';
import { IContent } from '../Content';
import { IODataParams } from '../ODataApi';
import { BaseRepository } from '../Repository/BaseRepository';
/**
 * Represents an instance of a Query expression.
 * Usage example:
 * ```ts
 * const query = new Query(q => q.TypeIs(ContentTypes.Task).And.Equals('DisplayName', 'Test'))
 * console.log(query.toString());   // the content query expression
 * ```
 */
export declare class Query<T extends IContent = IContent> {
    private readonly _segments;
    /**
     * Appends a new QuerySegment to the existing Query
     * @param {QuerySegment<T>} newSegment The Segment to be added
     */
    AddSegment(newSegment: QuerySegment<T>): void;
    /**
     * @returns {String} The Query expression as a sensenet Content Query
     */
    toString(): string;
    constructor(build: (first: QueryExpression<any>) => QuerySegment<T>);
    /**
     * Method that executes the Query and creates an OData request
     * @param {BaseRepository} repository The Repository instance
     * @param {string} path The Path for the query
     * @param {ODataParams} odataParams Additional OData parameters (like $select, $expand, etc...)
     * @returns {Observable<QueryResult<TReturns>>} An Observable that will publish the Query result
     */
    Exec(repository: BaseRepository, path: string, odataParams?: IODataParams<T>): Observable<QueryResult<T>>;
}
/**
 * Represents a finialized Query instance that has a Repository, path and OData Parameters set up
 */
export declare class FinializedQuery<T extends IContent = IContent> extends Query<T> {
    private readonly _repository;
    private readonly _path;
    private readonly _odataParams;
    constructor(build: (first: QueryExpression<any>) => QuerySegment<T>, _repository: BaseRepository, _path: string, _odataParams?: IODataParams<T>);
    /**
     * Executes the Query expression
     * Usage:
     * ```ts
     * const query = new Query(q => q.TypeIs(ContentTypes.Task).And.Equals('DisplayName', 'Test'))
     * query.Exec().subscribe(result=>{
     *  console.log(result);
     * })
     * ```
     */
    Exec(): Observable<QueryResult<T>>;
}
