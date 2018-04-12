import {SchemaBuilder} from './SchemaBuilder';

describe('SchemaBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new SchemaBuilder();
    });

    it('throws an error when the schema function is not overridden', () => {
      expect(() => builder.schema()).toThrow();
    });
});
