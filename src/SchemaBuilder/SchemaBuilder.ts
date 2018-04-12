/**
 * Simple base class from which all SchemaBuilders inherit
 */
export class SchemaBuilder {
    public schema(): object | Error {
        throw new Error('Not Implemented');
    }
}
