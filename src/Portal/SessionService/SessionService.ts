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

export interface ISessionServiceMetadata extends GenericObject {
    uuid: string;
    remoteAddress: string;
}

export interface ISessionServiceOptions extends IServiceSchemaOptions {
    metadata: ISessionServiceMetadata;
}

/**
 * The SessionService represents each individual connected player. A new SessionService instance is created for every
 * connection.
 */
export class SessionService extends ServiceSchema {
    private socket: Socket;

    get name() {
        return `portal.player.${this.metadata.uuid}`;
    }

    constructor(broker: ServiceBroker, socket: Socket, options: ISessionServiceOptions) {
        super(broker, options);
        this.socket = socket;
    }

    public schema() {
        const schema = super.schema();

        return {...schema, ...{created: this.created()}};
    }

    protected created() {
        const socket = this.socket;

        return  () => {
            this.socket = socket;
            this.logger.debug(`connected from ${this.metadata.remoteAddress}`);
            this.broker.broadcast('player.connected', this.metadata);
        };
    }
}
