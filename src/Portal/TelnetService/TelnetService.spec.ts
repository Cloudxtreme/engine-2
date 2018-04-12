import {Service, ServiceBroker} from 'moleculer';
import {Server} from 'net';

import {IPortalConfig} from '../Broker';
import {TelnetService} from './TelnetService';

jest.mock('net');

describe('TelnetService', () => {
    let service;
    let broker: ServiceBroker;

    const settings = {
        host: 'tcp://0.0.0.0:2323',
    };

    beforeEach(() => {
        broker = new ServiceBroker();
        service = new TelnetService(broker, {settings: <IPortalConfig>settings});
    });

    describe('constructor', () => {
        it('sets this.settings to the passed in configuration', () => {
            expect(service.serviceSettings).toHaveProperty('host', 'tcp://0.0.0.0:2323');
        });

        it('correctly sets the service name', () => {
            expect(service.name).toEqual('portal.telnet');
        });
    });

    describe('created', () => {
        beforeEach(() => {
            service = new Service(broker, new TelnetService(broker, {settings}).schema());
        });

        it('assigns the server variable', () => {
            expect(service.server).toBeInstanceOf(Server);
        });

        it('sets up the listening event', () => {
            expect(service.server._events.listening).toEqual(service.listening);
        });

        it('sets up the connection event', () => {
            expect(service.server._events.connection).toEqual(service.createSession);
        });

        it('calls listen with the correct settings', () => {
            expect(service.server.listen).toHaveBeenCalledWith({host: '0.0.0.0', port: '2323'});
        });

    });
});
