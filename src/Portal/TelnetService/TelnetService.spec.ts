import {IPortalConfig} from '../Broker';
import {TelnetService} from './TelnetService';

describe('TelnetService', () => {
    let service;
    const settings = {
        host: 'tcp://0.0.0.0:2323',
    };

    const mockLogger = {
        info() {
            return true;
        },
        debug() {
            return true;
        },
    };

    beforeEach(() => {
        service = new TelnetService(<IPortalConfig>settings);
        service.server.listen = jest.fn();
        service.schema = service;
        service.logger = mockLogger;
    });

    describe('constructor', () => {
        it('sets this.settings to the passed in configuration', () => {
            expect(service.settings).toHaveProperty('host', 'tcp://0.0.0.0:2323');
        });

        it('correctly sets the service name', () => {
            expect(service.name).toEqual('telnet');
        });
    });

    describe('created', () => {
        beforeEach(() => {
            service.created();
        });

        it('sets up the server resource', () => {
            expect(service.server).toBeDefined();
        });

        it('calls listen with the correct options', () => {
            expect(service.server.listen).toHaveBeenCalledWith({host: '0.0.0.0', port: '2323'});
        });

        it('sets up a listen event on the server', () => {
            expect(service.server._events).toHaveProperty('listening');
        });
    });
});
