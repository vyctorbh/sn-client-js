/// <reference types="mocha" />
export declare class ContentReferenceFieldTests {
    private _unloadedRef;
    private _loadedRef;
    private _repo;
    private _ownerContent;
    before(): void;
    'Should be able to construct ContentReferenceField from Deferred without loaded content reference'(): void;
    'Should be able to construct ContentReferenceField from IContentOptions with loaded content reference'(): void;
    'Getting unloaded referenced Content should trigger an OData call'(done: MochaDone): void;
    'Getting loaded referenced Content should NOT trigger an OData call'(done: MochaDone): void;
    'getValue should return undefined for unloaded reference'(): void;
    'getValue should return the loaded Path for a loaded reference'(): void;
    'SetContent should set the reference content'(done: MochaDone): void;
    'Search should return a FinializedQuery instance'(): void;
    'Search query should contain the term and default parameters'(): void;
    'Search query should contain selection roots if available'(): void;
    'Search query should contain allowed types if available'(): void;
    'Search query should not add type filter if not defined'(): void;
}
