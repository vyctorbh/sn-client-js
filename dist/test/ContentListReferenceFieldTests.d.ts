/// <reference types="mocha" />
export declare class ContentListReferenceFieldTests {
    private _unloadedRef;
    private _loadedRef;
    private _ownerContent;
    private _repo;
    before(): void;
    'Should be able to construct ContentReferenceField from Deferred without loaded content reference'(): void;
    'Should be able to construct ContentReferenceField from IContentOptions with loaded content reference'(): void;
    'Getting unloaded referenced Content should trigger an OData call'(done: MochaDone): void;
    'Getting loaded referenced Content should NOT trigger an OData call'(done: MochaDone): void;
    'getValue should return undefined for unloaded reference'(): void;
    'getValue should return the loaded Path for a loaded reference'(): void;
    'SetContent should set the reference content'(done: MochaDone): void;
}
