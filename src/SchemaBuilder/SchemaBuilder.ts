/**
 * Simple base class from which all SchemaBuilders inherit
 */
export abstract class SchemaBuilder {
    public abstract schema(): object | Error;
}
