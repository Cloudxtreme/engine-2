"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrokerSchema_1 = require("./BrokerSchema");
class TestSchema extends BrokerSchema_1.BrokerSchema {
    get SERVICE_NAME() {
        return 'TEST_SCHEMA';
    }
}
describe('BrokerSchema', () => {
    let builder;
    beforeEach(() => {
        builder = new TestSchema();
    });
    describe('#beforeStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            builder.beforeStart(callback);
            //tslint:disable-next-line:no-any
            expect(builder.beforeStartHooks).toEqual([callback]);
        });
    });
    describe('#afterStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            builder.afterStart(callback);
            //tslint:disable-next-line:no-any
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
//# sourceMappingURL=BrokerSchema.spec.js.map