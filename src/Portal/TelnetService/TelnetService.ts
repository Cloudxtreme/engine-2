import {LoggerInstance, ServiceSchema} from 'moleculer';
import * as net from 'net';

import {IPortalConfig} from '../Broker';

const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;

/**
 * The TelnetService handles the initial connection from the player client.
 */
export class TelnetService implements ServiceSchema {
    public name: string;
    public readonly settings: IPortalConfig;
    private readonly server: net.Server;
    private readonly logger: LoggerInstance;

    constructor(config: IPortalConfig) {
        this.name = 'telnet';
        // Moleculer ServiceSchema allows for settings to be defined in the "settings" object.d
        this.settings = config;
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
    }

    public created() {
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({host: group[1], port: group[2]});
    }

}
