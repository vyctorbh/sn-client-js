"use strict";
/**
 * @module Query
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
/**
 * Represents an instance of a Query expression.
 * Usage example:
 * ```ts
 * const query = new Query(q => q.TypeIs(ContentTypes.Task).And.Equals('DisplayName', 'Test'))
 * console.log(query.toString());   // the content query expression
 * ```
 */
class Query {
    constructor(build) {
        this._segments = [];
        const firstExpression = new _1.QueryExpression(this);
        build(firstExpression);
    }
    /**
     * Appends a new QuerySegment to the existing Query
     * @param {QuerySegment<T>} newSegment The Segment to be added
     */
    AddSegment(newSegment) {
        this._segments.push(newSegment);
    }
    /**
     * @returns {String} The Query expression as a sensenet Content Query
     */
    // tslint:disable-next-line:naming-convention
    toString() {
        return this._segments.map((s) => s.toString()).join('');
    }
    /**
     * Method that executes the Query and creates an OData request
     * @param {BaseRepository} repository The Repository instance
     * @param {string} path The Path for the query
     * @param {ODataParams} odataParams Additional OData parameters (like $select, $expand, etc...)
     * @returns {Observable<QueryResult<TReturns>>} An Observable that will publish the Query result
     */
    Exec(repository, path, odataParams = {}) {
        odataParams.query = this.toString();
        return repository.GetODataApi().Fetch({
            path,
            params: odataParams
        })
            .map((q) => {
            return {
                Result: q.d.results.map((c) => repository.HandleLoadedContent(c)),
                Count: q.d.__count
            };
        });
    }
}
exports.Query = Query;
/**
 * Represents a finialized Query instance that has a Repository, path and OData Parameters set up
 */
class FinializedQuery extends Query {
    constructor(build, _repository, _path, _odataParams = {}) {
        super(build);
        this._repository = _repository;
        this._path = _path;
        this._odataParams = _odataParams;
    }
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
    Exec() {
        return super.Exec(this._repository, this._path, this._odataParams);
    }
}
exports.FinializedQuery = FinializedQuery;
//# sourceMappingURL=Query.js.map