/// <reference types="mocha" />
export declare class BinaryFieldTests {
    private _file;
    private _repo;
    before(): void;
    private createField();
    'Can be constructed'(): void;
    'MediaResourceObject should be available'(): void;
    'DownloadUrl should be available'(): void;
    'DownloadUrl should be available without MediaResourceObject'(): void;
    'Parent.GetFullPath() should return the ParentContentPath'(done: MochaDone): void;
    'SaveBinaryFile() should trigger an upload request'(done: MochaDone): void;
    'SaveBinaryText() should trigger an upload request'(done: MochaDone): void;
}
