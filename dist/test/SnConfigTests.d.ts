export declare class SnConfigTests {
    'SnConfigFieldModel Should be constructed with SnConfigBehavior.Default'(): void;
    'SnConfigFieldModelStore return the Entity in the store '(): void;
    'SnConfigFieldModelStore Should throw error if entity isn\'t in the store '(): void;
    'SnConfigFieldModelStore Should throw an error if you try to add a field that already exists'(): void;
    'SnConfigFieldModelStore Should throw an error if you try to add a field without StoreKey'(): void;
    'GetCommandOptions should return only commands that has AllowFromCommandLine flag'(): void;
    'DEFAULT_BASE_URL should be equals to window.location.origin, if available'(): void;
}
