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
    private readonly server: net.Server;
    private readonly logger: LoggerInstance;
    private readonly schema: ServiceSchema;

    constructor(config: IPortalConfig) {
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
