import {Service, ServiceBroker} from 'moleculer';

jest.mock('../Apps', () => {
    const svcBuilder = jest.fn()
        .mockReturnValue({});
    const builder = jest.fn()
        .mockReturnValue(svcBuilder);

    return {
        App: builder,
    };
});

import {DEFAULT_CONFIG} from '../';
import {App, Signup} from '../Apps';
import {WorldLoop} from './WorldLoop';

describe('WorldLoop', () => {
    let service;
    let mockBroker;

    beforeEach(() => {
        mockBroker = new ServiceBroker();

        mockBroker.broadcast = jest.fn();
        mockBroker.destroyService = jest.fn();
        mockBroker.createService = jest.fn();
        service = new Service(mockBroker, WorldLoop(DEFAULT_CONFIG));
    });

    it('should have the correct name', () => {
        expect(service.name).toBe('world.loop');
    });

    it('assign the metadata', () => {
        expect(service.metadata).toEqual(DEFAULT_CONFIG);
    });

    describe('player.connected', () => {
        let event;
        const metadata = {meta: true};

        beforeEach(() => {
            event = service.schema.events['player.connected'].bind(service);
        });

        it('broadcasts loadApp with Login', () => {
            event(metadata);
            expect(mockBroker.broadcast).toHaveBeenCalledWith(
                'world.player.loadApp',
                {app: 'Login', ...metadata},
            );
        });

    });

    describe('player.disconnected', () => {
        let event;
        const metadata = {uuid: 'uuid'};

        beforeEach(() => {
            event = service.schema.events['player.disconnected'].bind(service);
        });

        describe('app is not loaded', () => {

            it('does not try and destroy the service', () => {
                mockBroker.getLocalService = jest.fn()
                    .mockReturnValue(undefined);
                event(metadata);
                expect(mockBroker.getLocalService).toHaveBeenCalledWith('world.player.uuid');
                expect(mockBroker.destroyService).not.toHaveBeenCalled();
            });

        });

        describe('app is loaded', () => {
            it('does not try and destroy the service', () => {
                mockBroker.getLocalService = jest.fn()
                    .mockReturnValue(service);
                event(metadata);
                expect(mockBroker.getLocalService).toHaveBeenCalledWith('world.player.uuid');
                expect(mockBroker.destroyService).toHaveBeenCalledWith(service);
            });
        });
    });

    describe('world.player.loadApp', () => {
        let event;
        const metadata = {uuid: 'uuid'};

        beforeEach(() => {
            event = service.schema.events['world.player.loadApp'].bind(service);
        });

        describe('previous app is not loaded', () => {

            it('does not try and destroy the service', () => {
                mockBroker.getLocalService = jest.fn()
                    .mockReturnValue(undefined);
                event({app: 'Signup', ...metadata});
                expect(mockBroker.getLocalService).toHaveBeenCalledWith('world.player.uuid');
                expect(mockBroker.destroyService).not.toHaveBeenCalled();
            });

        });

        describe('previous app app is loaded', () => {
            it('does not try and destroy the service', () => {
                mockBroker.getLocalService = jest.fn()
                    .mockReturnValue(service);
                event({app: 'Signup', ...metadata});
                expect(mockBroker.getLocalService).toHaveBeenCalledWith('world.player.uuid');
                expect(mockBroker.destroyService).toHaveBeenCalledWith(service);
            });
        });

        describe('calls broker createService with the built app', () => {
            it('creates a service from the App', () => {
                event({app: 'Signup', ...metadata});
                expect(mockBroker.createService).toHaveBeenCalledWith(App(Signup)());
            });
        });
    });
});
