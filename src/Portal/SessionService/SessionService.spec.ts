import {ServiceBroker} from 'moleculer';
import * as net from 'net';

import {SessionService} from './SessionService';

jest.mock('net');
describe('created', () => {
    let session;
    let socket;
    let broker;
    beforeEach(() => {
        socket = new net.Socket();
        socket.remoteAddress = 'testAddress';
        broker = new ServiceBroker();
        session = new SessionService(broker, socket, {
            metadata: {
                uuid: 'testUUID',
                remoteAddress: socket.remoteAddress,
            },
        });
        session.logger = {
            debug() {
                return;
            },
        };
    });

    it('broadcasts player.connected on the broker', () => {
        broker.broadcast = jest.fn();
        session.schema().created();
        expect(broker.broadcast).toHaveBeenCalledWith('player.connected', session.schema().metadata);
    });
});
