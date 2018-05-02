import {Service, ServiceBroker} from 'moleculer';
import {Server} from 'net';

import {DEFAULT_CONFIG} from '../Portal';
import {TelnetService} from './TelnetService';

jest.mock('net');

const mockBroker = new ServiceBroker();

describe('TelnetService', () => {
    let schema;
    let service;
    beforeEach(() => {
        schema = TelnetService(DEFAULT_CONFIG);
        service = new Service(mockBroker, schema);
    });

    it('should have the correct name', () => {
        expect(service.name).toEqual('portal.telnet');
    });

    it('assigns the passed in config to settings', () => {
        expect(service.settings).toEqual(DEFAULT_CONFIG);
    });

    describe('created', () => {
        it('creates a new socket server', () => {
            expect(service.server).toBeDefined();
        });

        it('sets up a listening event on the server to call the listening function', () => {
            schema = TelnetService(DEFAULT_CONFIG);
            schema.methods.listening = jest.fn();
            service = new Service(mockBroker, schema);
            service.server._events.listening();
            expect(schema.methods.listening).toHaveBeenCalled();
        });

        it('sets up a connection event on the server to call the createSession function', () => {
            schema = TelnetService(DEFAULT_CONFIG);
            schema.methods.createSession = jest.fn();
            service = new Service(mockBroker, schema);
            service.server._events.connection();
            expect(schema.methods.createSession).toHaveBeenCalled();
        });

        it('starts the listener', () => {
            schema = TelnetService(DEFAULT_CONFIG);
            schema.methods.createSession = jest.fn();
            service = new Service(mockBroker, schema);
            service.server._events.connection();
            expect(service.server.listen).toHaveBeenCalled();
        });
    });

});
