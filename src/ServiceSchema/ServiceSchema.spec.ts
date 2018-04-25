import {
    Actions,
    GenericObject,
    ServiceBroker,
    ServiceMethods,
    ServiceSettingSchema,
} from 'moleculer';

import {ServiceSchema} from './ServiceSchema';

function testAction() {
    return true;
}

function testMethod() {
    return true;
}

let broker;
let service;

describe('ServiceSchema', () => {

    describe('getters', () => {

        class TestService extends ServiceSchema {
            protected readonly actions: Actions = {
                testAction,
            };

            protected readonly methods: ServiceMethods = {
                testMethod,
            };

            protected readonly settings: ServiceSettingSchema = {
                someSetting: 'set',
            };

            protected readonly metadata: GenericObject = {
                someMetadata: 'set',
            };
        }

        beforeEach(() => {
            broker = new ServiceBroker();
            service = new TestService(broker);
        });

        it('merges the actions object', () => {
            expect(service.schema().actions.testAction).toEqual(testAction);
        });

        it('merges the methods object', () => {
            expect(service.schema().methods.testMethod).toEqual(testMethod);
        });

        it('merges the settings object', () => {
            expect(service.schema().settings).toEqual({someSetting: 'set'});
        });

        it('merges the settings object', () => {
            expect(service.schema().metadata).toEqual({someMetadata: 'set'});
        });

    });

    describe('options', () => {
        class TestService extends ServiceSchema {
        }

        beforeEach(() => {
            broker = new ServiceBroker();
            service = new TestService(broker, {
                settings: {
                    someSetting: true,
                },
                metadata: {
                    someMetadata: true,
                },
            });
        });

        it('merges the options.settings object', () => {
            expect(service.schema().settings).toEqual({someSetting: true});
        });

        it('merges the options.metadata object', () => {
            expect(service.schema().metadata).toEqual({someMetadata: true});
        });
    });
});
