"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaBuilder_1 = require("./SchemaBuilder");
describe('SchemaBuilder', () => {
    let builder;
    beforeEach(() => {
        builder = new SchemaBuilder_1.SchemaBuilder();
    });
    it('throws an error when the schema function is not overridden', () => {
        expect(() => builder.schema()).toThrow();
    });
});
//# sourceMappingURL=SchemaBulder.spec.js.map