import {
    Context,
    GenericObject,
    ServiceBroker,
    ServiceSettingSchema,
} from 'moleculer';
import {Socket} from 'net';

import {
    IServiceSchemaOptions,
    ServiceSchema,
} from '../../ServiceSchema';

interface ISessionServiceMetadata extends GenericObject {
    uuid: string;
    remoteAddress: string;
}

interface ISessionServiceSettings extends ServiceSettingSchema {
    socket: Socket;
}

export interface ISessionServiceOptions extends IServiceSchemaOptions {
    metadata: ISessionServiceMetadata;
    settings: ISessionServiceSettings;
}

/**
 * The SessionService represents each individual connected player. A new SessionService instance is created for every
 * connection.
 */
export class SessionService extends ServiceSchema {
    private socket: Socket;

    constructor(broker: ServiceBroker, options: ISessionServiceOptions) {
        super(broker, options);
    }

    protected created() {
        this.socket = this.settings.socket;
        this.logger.debug(`connected from ${this.metadata.remoteAddress}`);
        this.broker.broadcast('player.connected', this.metadata);
    }
}
