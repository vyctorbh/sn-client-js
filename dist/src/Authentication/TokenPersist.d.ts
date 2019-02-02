/**
 * @module Authentication
 */ /** */
/**
 * This enum shows how the token should be persisted.
 */
export declare enum TokenPersist {
    /**
     * Token should be removed on session end (browser close)
     */
    Session = 0,
    /**
     * Token should be removed when the token will be expired
     */
    Expiration = 1,
}
