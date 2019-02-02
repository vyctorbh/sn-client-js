"use strict";
/**
 * @module Config
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const snconfigbehavior_1 = require("./snconfigbehavior");
/**
 * Class that stores the model data for the SnConfigModel's fields, it's values are, filled by the SnConfigField decorator.
 */
class SnConfigFieldModelStore {
    /**
     * Adds a new model to the store
     * @param newModel {SnConfigFieldModel} The field model to be added
     * @throws error if a field with the same name already exists
     */
    static Add(newModel) {
        if (!newModel.StoreKey) {
            throw Error('No Store key defined');
        }
        if (this.Contains(newModel.StoreKey)) {
            throw new Error(`Field ${newModel.StoreKey} for configuration model already in the store!`);
        }
        this._store.set(newModel.StoreKey, newModel);
    }
    /**
     * Returns an entry for the specified field
     * @param fieldName {string} The field's name to search for
     * @throws error {error} if the store doesn't contain entry for the field.
     */
    static Get(storeKey) {
        const found = this._store.get(storeKey);
        if (!found) {
            throw new Error(`No entry found with the field name '${storeKey}'`);
        }
        return found;
    }
    /**
     * Checks if the store contains value with the specified field
     * @param fieldName fieldName {string} The field's name to search for
     */
    static Contains(fieldName) {
        return this._store.has(fieldName);
    }
    /**
     * Gets the fields which are available for command line option input
     * @returns {SnCofigFieldModel[]} The listof the fields
     */
    static GetCommandOptions() {
        const items = [];
        for (const field in this._store) {
            const found = this._store.get(field);
            if (field && found && (found.Behavior & snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine) === snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine) {
                items.push(found);
            }
        }
        return items;
    }
}
/**
 * An array that contains the field definitions.
 */
SnConfigFieldModelStore._store = new Map();
exports.SnConfigFieldModelStore = SnConfigFieldModelStore;
//# sourceMappingURL=snconfigfieldmodelstore.js.map