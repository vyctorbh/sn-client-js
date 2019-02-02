/// <reference types="mocha" />
export declare class QueryTests {
    'Can be constructed'(): void;
    'Can be from a repository'(done: MochaDone): void;
    'Should throw Error when try to run from a Content without Path'(): void;
    'Can be from a Content'(done: MochaDone): void;
    'Term syntax'(): void;
    'TypeIs syntax'(): void;
    'Type syntax'(): void;
    'InFolder with Path'(): void;
    'InFolder with Content'(): void;
    'InTree with Path'(): void;
    'InTree with Content'(): void;
    'Equals'(): void;
    'NotEquals'(): void;
    'Between exclusive'(): void;
    'Between Inclusive'(): void;
    'GreatherThan Exclusive'(): void;
    'GreatherThan Inclusive'(): void;
    'LessThan Exclusive'(): void;
    'LessThan Inclusive'(): void;
    'AND syntax'(): void;
    'OR syntax'(): void;
    'inner Query'(): void;
    'NOT statement'(): void;
    'OrderBy'(): void;
    'OrderBy Reverse'(): void;
    'Top'(): void;
    'Skip'(): void;
    'Issue Example output'(): void;
}
