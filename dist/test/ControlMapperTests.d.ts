export declare class ControlMapperTests {
    private _mapper;
    private _repository;
    before(): void;
    'example'(): void;
    'Should be able to construct with BaseType and ClientControlSettingsFactory'(): void;
    'Should be able to construct with all parameters'(): void;
    'Should return correct Default Control for ContentTypes'(): void;
    'Should return correct explicit defined Control for ContentTypes'(): void;
    'Should return correct Default Control for FieldSettings'(): void;
    'Should return correct explicit defined Control for FieldSettings'(): void;
    'Should return a correct default control for a specified Content Field'(): void;
    'Should return a correct default control for a specified Content Field when FieldSetting has default value'(): void;
    'Should return a correct default control for a specified Content Field when there is a ContentType bound setting specified'(): void;
    'CreateClientSetting should run with defult factory method by default'(): void;
    'CreateClientSetting should be able to run with an overridden factory method'(): void;
    'GetAllMappingsForContentTye should be able to return all mappings'(): void;
    'GetAllMappingsForContentTye filtered to View should be able to return all mappings'(): void;
    'GetAllMappingsForContentTye filtered to Edit should be able to return all mappings'(): void;
    'GetAllMappingsForContentTye filtered to New should be able to return all mappings'(): void;
    'GetFullSchemaForContent filtered to New should be able to return all mappings'(): void;
}
