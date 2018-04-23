import {BrokerSchema} from './BrokerSchema';

class TestSchema extends BrokerSchema {
    get PROCESS_NAME() {
        return 'TEST_SCHEMA';
    }

    get DEFAULT_CONFIG() {
        return {};
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
            expect((<any>builder.beforeStartHooks)).toEqual([callback]);
        });
    });

    describe('#afterStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            builder.afterStart(callback);
            //tslint:disable-next-line:no-any
            expect((<any>builder.afterStartHooks)).toEqual([callback]);
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
