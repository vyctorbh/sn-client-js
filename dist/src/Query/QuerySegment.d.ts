/**
 * @module Query
 */ /** */
import { Query } from '.';
import { IContent, SavedContent } from '../Content';
/**
 * Represents a query expression segment
 */
export declare class QuerySegment<TReturns extends IContent> {
    protected readonly _queryRef: Query<TReturns>;
    /**
     * Escapes a String value (except '?' and '*' characters for wildcards)
     * @param {string} value The String value to be escaped
     * @returns {string} The escaped value
     */
    protected escapeValue(value: string): string;
    protected _stringValue: string;
    /**
     * A '.SORT' Content Query segment
     * @param {K} field The name of the field
     * @param {boolean} reverse Sort in reverse order, false by default
     */
    Sort<K extends keyof TReturns>(field: K, reverse?: boolean): QuerySegment<TReturns>;
    /**
     * A '.TOP' Content Query segment
     * @param {number} topCount The TOP item count
     */
    Top(topCount: number): QuerySegment<TReturns>;
    /**
     * Adds a '.SKIP' Content Query segment
     * @param {number} skipCount Items to skip
     */
    Skip(skipCount: number): QuerySegment<TReturns>;
    /**
     * @returns {string} a segment string value
     */
    toString(): string;
    constructor(_queryRef: Query<TReturns>);
    protected finializeSegment(): QuerySegment<TReturns>;
}
/**
 * Represents a sensenet Content Query expression
 */
export declare class QueryExpression<TReturns extends IContent> extends QuerySegment<TReturns> {
    /**
     * A plain string as Query term
     * @param {string} term The Query term
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    Term(term: string): QueryOperators<TReturns>;
    /**
     * Adds an InTree content query expression
     * @param {string | Content } path The path string or content that will be used as a root
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    InTree(path: string | SavedContent): QueryOperators<TReturns>;
    /**
     * Adds an InFolder content query expression
     * @param {string | Content } path The path string or content that will be used as a root
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    InFolder(path: string | SavedContent): QueryOperators<TReturns>;
    /**
     * Adds a Type content query expression and casts the rest of the expression to a new type
     * @param {{ new(...args: any[]): TNewType }} newTypeAssertion The path string or content that will be used as a root
     * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
     */
    Type<TNewType extends IContent = IContent>(newTypeAssertion: {
        new (...args: any[]): TNewType;
    }): QueryOperators<TNewType>;
    /**
     * Adds a TypeIs content query expression and casts the rest of the expression to a new type
     * @param {{ new(...args: any[]): TNewType }} newTypeAssertion The path string or content that will be used as a root
     * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
     */
    TypeIs<TNewType extends IContent = IContent>(newTypeAssertion: {
        new (...args: any[]): TNewType;
    }): QueryOperators<TNewType>;
    /**
     * Field equality check content query expression (e.g. +FieldName:'value')
     * @param { K } FieldName The name of the Field to be checked
     * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    Equals<K extends keyof TReturns>(fieldName: K | '_Text', value: TReturns[K]): QueryOperators<TReturns>;
    /**
     * Field equality and NOT operator combination. (e.g. +NOT(FieldName:'value'))
     * @param { K } FieldName The name of the Field to be checked
     * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
     * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
     */
    NotEquals<K extends keyof TReturns>(fieldName: K, value: TReturns[K]): QueryOperators<TReturns>;
    /**
     * Range search query expression
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } minValue The minimum allowed value
     * @param { TReturns[K] } maxValue The maximum allowed value
     * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
     * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
     */
    Between<K extends keyof TReturns>(fieldName: K, minValue: TReturns[K], maxValue: TReturns[K], minimumInclusive?: boolean, maximumInclusive?: boolean): QueryOperators<TReturns>;
    /**
     * Greather than query expression (+FieldName:>'value')
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } minValue The minimum allowed value
     * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
     */
    GreatherThan<K extends keyof TReturns>(fieldName: K, minValue: TReturns[K], minimumInclusive?: boolean): QueryOperators<TReturns>;
    /**
     * Less than query expression (+FieldName:<'value')
     * @param { K } fieldName he name of the Field to be checked
     * @param { TReturns[K] } maxValue The maximum allowed value
     * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
     */
    LessThan<K extends keyof TReturns>(fieldName: K, maxValue: TReturns[K], maximumInclusive?: boolean): QueryOperators<TReturns>;
    /**
     * A Nested query expression
     * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
     */
    Query(build: (first: QueryExpression<TReturns>) => QuerySegment<TReturns>): QueryOperators<TReturns>;
    /**
     * A Nested NOT query expression
     * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
     */
    Not(build: (first: QueryExpression<TReturns>) => QuerySegment<TReturns>): QueryOperators<TReturns>;
    protected finialize<TReturnsExtended extends IContent = TReturns>(): QueryOperators<TReturnsExtended>;
}
export declare class QueryOperators<TReturns extends IContent> extends QuerySegment<TReturns> {
    /**
     * AND Content Query operator
     */
    readonly And: QueryExpression<TReturns>;
    /**
     * OR Content Query operator
     */
    readonly Or: QueryExpression<TReturns>;
    protected finialize(): QueryExpression<TReturns>;
}
