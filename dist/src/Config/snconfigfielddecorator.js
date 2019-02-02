"use strict";
/**
 * @module Config
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const snconfigfieldmodelstore_1 = require("./snconfigfieldmodelstore");
/**
 * This function has to be used in the SnConfigModel class to provide additional metadata for the SnConfig fields
 * @param model {SnConfigFieldModel} The field model parameters
 * @returns {function(SnConfigModel)} A factory method which fills the SnConfigModelStore
 * with for the decorated field with the provided field model data
 */
exports.SnConfigField = (model) => {
    return (target, propertyName) => {
        model.FieldName = propertyName;
        model.StoreKey = `${target.constructor.name}.${propertyName}`;
        snconfigfieldmodelstore_1.SnConfigFieldModelStore.Add(model);
    };
};
//# sourceMappingURL=snconfigfielddecorator.js.map