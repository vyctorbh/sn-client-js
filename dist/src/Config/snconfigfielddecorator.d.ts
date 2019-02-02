/**
 * @module Config
 */ /** */
import { SnConfigFieldModel } from './snconfigfieldmodel';
/**
 * This function has to be used in the SnConfigModel class to provide additional metadata for the SnConfig fields
 * @param model {SnConfigFieldModel} The field model parameters
 * @returns {function(SnConfigModel)} A factory method which fills the SnConfigModelStore
 * with for the decorated field with the provided field model data
 */
export declare const SnConfigField: (model: SnConfigFieldModel) => (target: any, propertyName: string) => void;
