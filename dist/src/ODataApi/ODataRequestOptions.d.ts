/**
 * @module ODataApi
 */ /** */
import { IContent } from '../Content';
import { IODataParams } from './';
export declare class IODataRequestOptions<T extends IContent> {
    path: string;
    params?: IODataParams<T>;
    async?: boolean;
    type?: string;
    success?: () => void;
    error?: () => void;
    complete?: () => void;
}
