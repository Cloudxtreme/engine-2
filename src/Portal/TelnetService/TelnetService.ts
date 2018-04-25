import {ServiceMethods} from 'moleculer';
import * as net from 'net';
import * as uuid from 'uuid';

import {ServiceSchema} from '../../ServiceSchema';
import {IPortalConfig} from '../Portal';
import {SessionService} from '../SessionService';

const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;

/**
 * The TelnetService handles the initial connection from the player client, and spawns the individual session services.
 */
export class TelnetService extends ServiceSchema {
    public server: net.Server;
    public settings: IPortalConfig;

    protected readonly name: string = 'portal.telnet';
    protected readonly methods: ServiceMethods = {
        listening: this.listening,
        createSession: this.createSession,
    };

    protected created() {
        this.server = net.createServer();
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        this.server.on('listening', this.listening);
        this.server.on('connection', this.createSession);
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({host: group[1], port: group[2]});
    }

    private listening() {
        this.logger.info(`listening on ${this.settings.host}`);
    }

    private createSession(socket: net.Socket) {
        const sessionService = new SessionService(
            this.broker,
            socket,
            {
                metadata: {
                    uuid: uuid.v1(),
                    remoteAddress: socket.remoteAddress,
                },
            },
        );
        this.broker.createService(sessionService.schema());
    }

}
