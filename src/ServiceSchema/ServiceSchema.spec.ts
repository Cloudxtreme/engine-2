import {ServiceBroker} from 'moleculer';
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
            get actions() {
                return {
                    testAction,
                };
            }

            get methods() {
                return {
                    testMethod,
                };
            }

            get settings() {
                return {
                    someSetting: true,
                };
            }

            get someMetadata() {
                return {
                    someMetadata: true,
                };
            }
        }

        beforeEach(() => {
            broker = new ServiceBroker();
            service = new TestService(broker);
        });

        it('merges the serviceActions object', () => {
            expect(service.serviceActions.testAction).toEqual(testAction);
        });

        it('merges the serviceMethods object', () => {
            expect(service.serviceMethods.testMethod).toEqual(testMethod);
        });

        it('merges the serviceSettings object', () => {
            expect(service.serviceSettings.someSetting).toEqual(true);
        });

        it('merges the serviceMetadata object', () => {
            expect(service.someMetadata.someMetadata).toEqual(true);
        });

        it('sets the broker', () => {
            expect(service.broker).toEqual(broker);
        });
    });

    describe('options', () => {
        class TestService extends ServiceSchema {
        }

        beforeEach(() => {
            broker = new ServiceBroker();
            service = new TestService(broker, {
                actions: {
                    testAction,
                },
                methods: {
                    testMethod,
                },
                settings: {
                    someSetting: true,
                },
                metadata: {
                    someMetadata: true,
                },
            });
        });

        it('merges the options.actions', () => {
            expect(service.serviceActions.testAction).toEqual(testAction);
        });

        it('merges the options.methods', () => {
            expect(service.serviceMethods.testMethod).toEqual(testMethod);
        });

        it('merges the options.settings object', () => {
            expect(service.serviceSettings.someSetting).toEqual(true);
        });

        it('merges the options.metadata object', () => {
            expect(service.serviceMetadata.someMetadata).toEqual(true);
        });
    });

    describe('schema', () => {
        class TestService extends ServiceSchema {
            get name() {
                return 'testService';
            }
        }

        beforeEach(() => {
            broker = new ServiceBroker();
            service = new TestService(broker, {
                actions: {
                    testAction,
                },
                methods: {
                    testMethod,
                },
                settings: {
                    someSetting: true,
                },
                metadata: {
                    someMetadata: true,
                },
            });
        });
    });

    it('returns a valid service schema', () => {
        expect(service.schema()).toEqual({
            name: service.name,
            actions: service.serviceActions,
            settings: service.serviceSettings,
            metadata: service.serviceMetadata,
            methods: service.serviceMethods,
            created: service.created,
        });
    });
});
