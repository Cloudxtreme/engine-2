import {ServiceBroker} from 'moleculer';
import {Socket} from 'net';

import {IServiceSchemaOptions, ServiceSchema} from '../../ServiceSchema';

export interface ISessionServiceSettings {
    uuid: string;
}

interface ISessionServiceOptions extends IServiceSchemaOptions {
    socket: Socket;
}

/**
 * The SessionService handles incoming connections and creates the player service for the connection.
 */
export class SessionService extends ServiceSchema {
    public serviceSettings: ISessionServiceSettings;
    public socket: Socket;

    constructor(broker: ServiceBroker, options: ISessionServiceOptions) {
        super(broker, options);
        this.socket = options.socket;
    }

    get name() {
        return `portal.sessions.${this.serviceSettings.uuid}`;
    }

    public created() {
        const socket = this.socket;

        return function () {
            this.socket = socket;
            this.logger.debug(`received connection from ${this.socket.remoteAddress}`);
            this.broker.call('world.sessions.connected', {
                address: this.socket.remoteAddress,
                uuid: this.settings.uuid,
            });
        };
    }

    public schema() {
        const schema = super.schema();

        return {...schema, ...{created: this.created()}};
    }
}
