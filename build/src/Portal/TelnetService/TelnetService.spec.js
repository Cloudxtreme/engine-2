"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const net_1 = require("net");
const TelnetService_1 = require("./TelnetService");
jest.mock('net');
describe('TelnetService', () => {
    let service;
    let broker;
    const settings = {
        host: 'tcp://0.0.0.0:2323',
    };
    beforeEach(() => {
        broker = new moleculer_1.ServiceBroker();
        service = new TelnetService_1.TelnetService(broker, { settings: settings });
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
            service = new moleculer_1.Service(broker, new TelnetService_1.TelnetService(broker, { settings }).schema());
        });
        it('assigns the server variable', () => {
            expect(service.server).toBeInstanceOf(net_1.Server);
        });
        it('sets up the listening event', () => {
            expect(service.server._events.listening).toEqual(service.listening);
        });
        it('sets up the connection event', () => {
            expect(service.server._events.connection).toEqual(service.createSession);
        });
        it('calls listen with the correct settings', () => {
            expect(service.server.listen).toHaveBeenCalledWith({ host: '0.0.0.0', port: '2323' });
        });
    });
});
//# sourceMappingURL=TelnetService.spec.js.map