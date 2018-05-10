import {
    Service,
    ServiceBroker,
} from 'moleculer';

import {ISessionMetadata} from '../../../Portal/SessionService';
import {StateManager} from '../../../StateManager';
import {App, IApp} from './App';

const appDefinition: IApp = {
    appName: 'AnApp',
    started: jest.fn(),
    initialState: {
        state: 'yay!',
    },
    handleInput: jest.fn(),
    methods: {
        someMethod: jest.fn(),
    },
};

const config: ISessionMetadata = {
    uuid: 'uuid',
    createdAt: 1111,
    remoteAddress: 'remoteAddress',
};

const appConstructor = App(appDefinition);

const mockBroker = new ServiceBroker();
mockBroker.call = jest.fn();
mockBroker.broadcast = jest.fn();

describe('App', () => {
    let app;
    let service;

    beforeEach(() => {
        app = appConstructor(config);
        service = new Service(mockBroker, app);
    });

    describe('constructor', () => {
        it('sets the name correctly', () => {
            expect(service.name).toBe(`world.player.${config.uuid}`);
        });

        it('sets the metadata', () => {
            expect(service.metadata).toEqual(config);
        });

        it('sets the dependencies to the portal player service', () => {
            expect(app.dependencies).toEqual([`portal.player.${config.uuid}`]);
        });

        it('merges the methods in the appDefninition', () => {
            expect(app.methods.someMethod).toEqual(appDefinition.methods.someMethod);
        });
    });

    describe('created', () => {
        it('sets the state manager', () => {
            service.created();
            expect(service.state instanceof StateManager).toBeTruthy();
        });
    });

    describe('started', () => {
        it('calls appDefinition.started', () => {
            return app.started.bind(mockBroker)()
                .then(() => {
                    expect(appDefinition.started).toHaveBeenCalled();
                });
        });
    });

    describe('sendToScreen', () => {
        it('calls sendToScreen on the portal service', () => {
            service.sendToScreen('a message');
            expect(mockBroker.call).toHaveBeenCalledWith(
                `portal.player.${config.uuid}.sendToScreen`,
                expect.objectContaining({
                ...app.metadata,
                message: 'a message',
            }));
        });
    });

    describe('switchApp', () => {
        it('calls broadcast tot he loadApp handler', () => {
            service.switchApp('Signup');
            expect(mockBroker.broadcast).toHaveBeenCalledWith(
                'world.player.loadApp',
                {
                    ...config,
                    app: 'Signup',
                },
            );
        });
    });

    describe('sendToWorld', () => {
        it('calls handleInput defined by the app', () => {
            service.actions.sendToWorld({message: 'string'});
            expect(appDefinition.handleInput).toHaveBeenCalledWith({message: 'string'});
        });
    });

});
