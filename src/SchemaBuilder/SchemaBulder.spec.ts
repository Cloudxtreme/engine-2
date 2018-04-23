import {SchemaBuilder} from './SchemaBuilder';

describe('SchemaBuilder', () => {
    let builder;
    class TestBuilder extends SchemaBuilder {
        public schema() {
            return {
                anObject: true,
            };
        }
    }

    beforeEach(() => {
        builder = new TestBuilder();
    });

    it('throws an error when the schema function is not overridden', () => {
      expect(builder.schema().anObject).toEqual(true);
    });
});
