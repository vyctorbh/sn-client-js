/**
 * @module ComplexTypes
 * @preferred
 *
 * @description Module containing complex data types like HyperLink or ChoiceOption.
 *
 * This module is autogenerated from Sense/Net ContentRepository.
 *
 * ```
 * let link = new Fields.HyperlinkData({
 *   Href: 'http://sensenet.com',
 *   Text: 'Link to sensenet.com',
 *   Title: 'Go to sensenet.com',
 *   Target: '_blank'
 * });
 *
 * let webContent = new ContentTypes.WebContentDemo({
 *   Id: 1,
 *   Name: 'MyContent',
 *   DisplayName: 'My Content',
 *   Type: 'WebContentDemo',
 *   Details: link
 * });
 *
 * ```
 */ /** */
export declare class ChoiceOption {
    Value: string;
    Text?: string;
    Enabled?: boolean;
    Selected?: boolean;
    constructor(value: string, text?: string, enabled?: boolean, selected?: boolean);
}
export declare class DeferredUriObject {
    uri: string;
}
export declare class DeferredObject extends Object {
    __deferred: DeferredUriObject;
}
export declare class MediaObject {
    edit_media: string;
    media_src: string;
    content_type: string;
    media_etag: string;
}
export declare class MediaResourceObject extends Object {
    __mediaresource: MediaObject;
}