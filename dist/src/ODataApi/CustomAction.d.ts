/**
 * @module ODataApi
 */ /** */
/**
 * Class that represents a custom OData Action
 */
export declare class CustomAction {
    name: string;
    id?: number;
    path?: string;
    params: string[];
    requiredParams: string[];
    isAction: boolean;
    noCache: boolean;
    constructor(options: ICustomActionOptions);
}
/**
 * Interface that represents an options to institiating a CustomAction or CustomContentAction
 */
export interface ICustomActionOptions {
    name: string;
    id?: number;
    path?: string;
    params?: string[];
    requiredParams?: string[];
    isAction?: boolean;
    noCache?: boolean;
}
