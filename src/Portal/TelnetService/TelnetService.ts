import {LoggerInstance} from 'moleculer';
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
export class TelnetService extends ServiceSchema  {
    public readonly name: string;
    public settings: IPortalConfig;
    protected readonly schema: TelnetService = this;
    private readonly server: net.Server;

    constructor(config: IPortalConfig) {
        super();
        this.name = 'telnet';
        // Moleculer ServiceSchema allows for settings to be defined in the "settings" object.d
        this.settings = config;
        // setup the tcp server
        this.server = net.createServer();

    }

    public created() {
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        this.schema.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.schema.server.on('connection', (socket: net.Socket) => {
            const sessionService = new SessionService(<string>uuid(), socket);
            this.broker.createService(sessionService);
        });
        const group = this.settings.host.match(HOST_REGEX);
        this.schema.server.listen({host: group[1], port: group[2]});
    }

}
