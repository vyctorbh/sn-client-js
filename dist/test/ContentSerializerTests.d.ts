export declare class ContentSerializerTests {
    private _content;
    private _contentSerializedString;
    private _repo;
    private _repo2;
    before(): void;
    'content.Stringify() should create a valid output'(): void;
    'content.Stringify() should throw an error when no Path specified'(): void;
    'Repository.Parse should return a Content instance'(): void;
    'Repository.Parse should throw an Error when trying parse a Content from a different Repository origin'(): void;
}
