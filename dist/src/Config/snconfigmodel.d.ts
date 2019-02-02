/**
 * @module Config
 */ /** */
import { Content } from '../Content';
import { ODataFieldParameter, ODataMetadataType } from '../ODataApi/ODataParams';
/**
 * Class that represents a typed model for the Sense/Net related configuration for an NPM Package. The values can be populated from sn.config.js.
 */
export declare class SnConfigModel {
    /**
     * The default base URL, returns window.location if available
     */
    static readonly DEFAULT_BASE_URL: string;
    /**
     * The default Sense/Net OData Service token (odata.svc)
     */
    static readonly DEFAULT_SERVICE_TOKEN: string;
    /**
     * The root URL for the Sense/Net repository (e.g.: demo.sensenet.com)
     */
    RepositoryUrl: string;
    /**
     * The service token for the OData Endpoint
     */
    ODataToken: string;
    /**
     * This string represents how the Jwt Web Token will be stored in the localStorage.
     */
    JwtTokenKeyTemplate: string;
    /**
     * This string describes how long the JWT token should be persisted.
     */
    JwtTokenPersist: 'session' | 'expiration';
    /**
     * This parameter describes what fields should be included in the OData $select statements by default
     */
    DefaultSelect: ODataFieldParameter<Content> | 'all';
    /**
     * This parameter describes what fields should always be included in the OData $select statements
     */
    RequiredSelect: ODataFieldParameter<Content>;
    /**
     * This field sets the default OData $metadata value
     */
    DefaultMetadata: ODataMetadataType;
    /**
     * This field sets the default OData inline count value
     */
    DefaultInlineCount: 'allpages' | 'none';
    /**
     * This field describes what fields should be expanded on every OData request by default
     */
    DefaultExpand: ODataFieldParameter<Content> | undefined;
    /**
     * This field sets up a default OData $top parameter
     */
    DefaultTop: number;
    /**
     * Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend
     */
    ChunkSize: number;
    /**
     *
     * @param {Partial<SnConfigMoel>} config Partial config values, the default values will be overwritten if provided
     * @constructs {SnConfigModel}
     */
    constructor(config?: Partial<SnConfigModel>);
}
