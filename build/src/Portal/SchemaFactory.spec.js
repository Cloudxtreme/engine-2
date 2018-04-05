"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaFactory_1 = require("./SchemaFactory");
describe('Broker', () => {
    let builder;
    beforeEach(() => {
        builder = new SchemaFactory_1.Portal.Broker();
    });
    describe('#beforeStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            builder.beforeStart(callback);
            expect(builder.beforeStartHooks).toEqual([callback]);
        });
    });
    describe('#afterStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            builder.afterStart(callback);
            expect(builder.afterStartHooks).toEqual([callback]);
        });
    });
    describe('#schema', () => {
        it('it assigns runBeforeStartHooks to .created', () => {
            builder.runBeforeStartHooks = jest.fn();
            const schema = builder.schema();
            expect(schema.created).toEqual(builder.runBeforeStartHooks());
        });
    });
});
//# sourceMappingURL=Broker.spec.js.map