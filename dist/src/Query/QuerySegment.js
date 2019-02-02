"use strict";
/**
 * @module Query
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
/**
 * Represents a query expression segment
 */
class QuerySegment {
    constructor(_queryRef) {
        this._queryRef = _queryRef;
    }
    /**
     * Escapes a String value (except '?' and '*' characters for wildcards)
     * @param {string} value The String value to be escaped
     * @returns {string} The escaped value
     */
    escapeValue(value) {
        return typeof value === 'string' ? value.replace(/([\!\+\&\|\(\)\[\]\{\}\^\~\:\"])/g, '\\$1') : value;
    }
    /**
     * A '.SORT' Content Query segment
     * @param {K} field The name of the field
     * @param {boolean} reverse Sort in reverse order, false by default
     */
    Sort(field, reverse = false) {
        this._stringValue = ` .${reverse ? 'REVERSESORT' : 'SORT'}:${field}`;
        return this.finializeSegment();
    }
    /**
     * A '.TOP' Content Query segment
     * @param {number} topCount The TOP item count
     */
    Top(topCount) {
        this._stringValue = ` .TOP:${topCount}`;
        return this.finializeSegment();
    }
    /**
     * Adds a '.SKIP' Content Query segment
     * @param {number} skipCount Items to skip
     */
    Skip(skipCount) {
        this._stringValue = ` .SKIP:${skipCount}`;
        return this.finializeSegment();
    }
    /**
     * @returns {string} a segment string value
     */
    // tslint:disable-next-line:naming-convention
    toString() {
        return this._stringValue;
    }
    finializeSegment() {
        this._queryRef.AddSegment(this);
        return new QuerySegment(this._queryRef);
    }
}
exports.QuerySegment = QuerySegment;
/**
 * Represents a sensenet Content Query expression
 */
class QueryExpression extends QuerySegment {
    /**
     * A plain string as Query term
     * @param {string} term The Query term
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    Term(term) {
        this._stringValue = term;
        return this.finialize();
    }
    /**
     * Adds an InTree content query expression
     * @param {string | Content } path The path string or content that will be used as a root
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    InTree(path) {
        const pathValue = this.escapeValue(path.Path ? path.Path : path.toString());
        this._stringValue = `InTree:"${pathValue}"`;
        return this.finialize();
    }
    /**
     * Adds an InFolder content query expression
     * @param {string | Content } path The path string or content that will be used as a root
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    InFolder(path) {
        const pathValue = this.escapeValue(path.Path ? path.Path : path.toString());
        this._stringValue = `InFolder:"${pathValue}"`;
        return this.finialize();
    }
    /**
     * Adds a Type content query expression and casts the rest of the expression to a new type
     * @param {{ new(...args: any[]): TNewType }} newTypeAssertion The path string or content that will be used as a root
     * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
     */
    Type(newTypeAssertion) {
        this._stringValue = `Type:${newTypeAssertion.name}`;
        return this.finialize();
    }
    /**
     * Adds a TypeIs content query expression and casts the rest of the expression to a new type
     * @param {{ new(...args: any[]): TNewType }} newTypeAssertion The path string or content that will be used as a root
     * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
     */
    TypeIs(newTypeAssertion) {
        this._stringValue = `TypeIs:${newTypeAssertion.name}`;
        return this.finialize();
    }
    /**
     * Field equality check content query expression (e.g. +FieldName:'value')
     * @param { K } FieldName The name of the Field to be checked
     * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    Equals(fieldName, value) {
        this._stringValue = `${fieldName}:'${this.escapeValue(value)}'`;
        return this.finialize();
    }
    /**
     * Field equality and NOT operator combination. (e.g. +NOT(FieldName:'value'))
     * @param { K } FieldName The name of the Field to be checked
     * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    NotEquals(fieldName, value) {
        this._stringValue = `NOT(${fieldName}:'${this.escapeValue(value)}')`;
        return this.finialize();
    }
    /**
     * Range search query expression
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } minValue The minimum allowed value
     * @param { TReturns[K] } maxValue The maximum allowed value
     * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
     * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
     */
    Between(fieldName, minValue, maxValue, minimumInclusive = false, maximumInclusive = false) {
        this._stringValue = `${fieldName}:${minimumInclusive ? '[' : '{'}'${this.escapeValue(minValue)}' TO '${this.escapeValue(maxValue)}'${maximumInclusive ? ']' : '}'}`;
        return this.finialize();
    }
    /**
     * Greather than query expression (+FieldName:>'value')
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } minValue The minimum allowed value
     * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
     */
    GreatherThan(fieldName, minValue, minimumInclusive = false) {
        this._stringValue = `${fieldName}:>${minimumInclusive ? '=' : ''}'${this.escapeValue(minValue)}'`;
        return this.finialize();
    }
    /**
     * Less than query expression (+FieldName:<'value')
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } maxValue The maximum allowed value
     * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
     */
    LessThan(fieldName, maxValue, maximumInclusive = false) {
        this._stringValue = `${fieldName}:<${maximumInclusive ? '=' : ''}'${this.escapeValue(maxValue)}'`;
        return this.finialize();
    }
    /**
     * A Nested query expression
     * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
     */
    Query(build) {
        const innerQuery = new _1.Query(build);
        this._stringValue = `(${innerQuery.toString()})`;
        return this.finialize();
    }
    /**
     * A Nested NOT query expression
     * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
     */
    Not(build) {
        const innerQuery = new _1.Query(build);
        this._stringValue = `NOT(${innerQuery.toString()})`;
        return this.finialize();
    }
    finialize() {
        this._queryRef.AddSegment(this);
        return new QueryOperators(this._queryRef);
    }
}
exports.QueryExpression = QueryExpression;
// And, Or, Etc...
class QueryOperators extends QuerySegment {
    /**
     * AND Content Query operator
     */
    get And() {
        this._stringValue = ' AND ';
        return this.finialize();
    }
    /**
     * OR Content Query operator
     */
    get Or() {
        this._stringValue = ' OR ';
        return this.finialize();
    }
    finialize() {
        this._queryRef.AddSegment(this);
        return new QueryExpression(this._queryRef);
    }
}
exports.QueryOperators = QueryOperators;
//# sourceMappingURL=QuerySegment.js.map