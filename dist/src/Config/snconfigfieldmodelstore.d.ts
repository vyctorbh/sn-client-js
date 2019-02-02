import { SnConfigFieldModel } from './snconfigfieldmodel';
/**
 * Class that stores the model data for the SnConfigModel's fields, it's values are, filled by the SnConfigField decorator.
 */
export declare class SnConfigFieldModelStore {
    /**
     * An array that contains the field definitions.
     */
    private static _store;
    /**
     * Adds a new model to the store
     * @param newModel {SnConfigFieldModel} The field model to be added
     * @throws error if a field with the same name already exists
     */
    static Add(newModel: SnConfigFieldModel): void;
    /**
     * Returns an entry for the specified field
     * @param fieldName {string} The field's name to search for
     * @throws error {error} if the store doesn't contain entry for the field.
     */
    static Get(storeKey: string): SnConfigFieldModel;
    /**
     * Checks if the store contains value with the specified field
     * @param fieldName fieldName {string} The field's name to search for
     */
    static Contains(fieldName: string): boolean;
    /**
     * Gets the fields which are available for command line option input
     * @returns {SnCofigFieldModel[]} The listof the fields
     */
    static GetCommandOptions(): SnConfigFieldModel[];
}
