/**
 * Simple base class from which all Moleculer SchemaBuilders inherit. A valid schema builder should return an object
 * when `.schema()`  is called.
 */
export abstract class SchemaBuilder {
    /**
     * @returns {object} a moleculer schema
     */
    public abstract schema(): object;
}
