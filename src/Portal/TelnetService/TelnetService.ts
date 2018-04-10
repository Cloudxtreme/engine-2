import {LoggerInstance, ServiceBroker, ServiceSchema} from 'moleculer';
import * as net from 'net';

import {IPortalConfig} from '../Broker';
import {SessionService} from '../SessionService';

// tslint:disable
const uuid = require("uuid/v4");
// tslint:enable

const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;

/**
 * The TelnetService handles the initial connection from the player client.
 */
export class TelnetService implements ServiceSchema {
    public readonly name: string;
    public readonly broker: ServiceBroker;
    public readonly settings: IPortalConfig;
    private server: net.Server;
    private readonly logger: LoggerInstance;

    constructor(config: IPortalConfig) {
        this.name = 'telnet';
        // Moleculer ServiceSchema allows for settings to be defined in the "settings" object.d
        this.settings = config;
    }

    public created() {
        // setup the tcp server
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.server.on('connection', (socket: net.Socket) => {
            const sessionService = new SessionService(<string>uuid(), socket);
            this.broker.createService(sessionService);
        });
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({host: group[1], port: group[2]});

    }

}
