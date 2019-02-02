/**
 * @module Mocks
 */ /** */
import { SnConfigModel } from '../../src/Config';
import { BaseRepository } from '../../src/Repository/index';
import { MockAuthService } from './MockAuthService';
import { MockHttpProvider } from './MockHttpProvider';
export declare class MockRepository extends BaseRepository<MockHttpProvider, MockAuthService> {
    constructor(config?: Partial<SnConfigModel>);
}
