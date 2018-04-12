import * as net from 'net';

import {ServiceSchema} from '../../ServiceSchema';
import {IPortalConfig} from '../Broker';
import {SessionService} from '../SessionService';

// tslint:disable
const uuid = require("uuid/v4");
// tslint:enable

const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;

/**
 * The TelnetService handles the initial connection from the player client.
 */
export class TelnetService extends ServiceSchema {
    public server: net.Server;
    public settings: IPortalConfig;

    get name() {
        return 'portal.telnet';
    }

    public created() {
        this.server = net.createServer();
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.server.on('connection', (socket: net.Socket) => {
            const sessionService = new SessionService(
                this.broker,
                {
                    settings: {
                        uuid: uuid(),
                    },
                    socket,
                },
            );
            this.broker.createService(sessionService.schema());
        });
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({host: group[1], port: group[2]});
    }

}
