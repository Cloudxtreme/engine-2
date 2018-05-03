import {Service, ServiceBroker} from 'moleculer';
import * as net from 'net';

import {SessionService} from './SessionService';

jest.mock('net');

import {DEFAULT_CONFIG} from '../Portal';

const mockBroker = new ServiceBroker();

mockBroker.broadcast = jest.fn();

describe('SessionService', () => {
    let schema;
    let socket;
    let service;

    beforeEach(() => {
        socket = new net.Socket();
        schema = SessionService({...DEFAULT_CONFIG, socket: socket});
        service = new Service(mockBroker, schema);
    });

    it('has the correct name', () => {
        expect(schema.name).toEqual(`portal.player.${schema.metadata.uuid}`);
    });

    describe('metadata', () => {

        it('sets the uuid', () => {
            expect(schema.metadata.uuid).toBeDefined();
        });

        it('sets the createdAt field', () => {
            expect(schema.metadata.createdAt).toBeDefined();
        });

        it('sets the remote address', () => {
            expect(schema.metadata.remoteAddress).toBeDefined();
        });
    });

    describe('created', () => {
        it('sets up the close handler', () => {
            expect(socket.on).toHaveBeenCalledWith('close', service.onClose);
        });
    });

    describe('started', () => {
        it('broadcasts player.connected to the broker', () => {
            service.started()
                .then(() => {
                    expect(service.broker.broadcast).toHaveBeenCalledWith('player.connected', service.metadata);
                });
        });
    });
});
