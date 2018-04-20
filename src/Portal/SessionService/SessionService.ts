import {Context, ServiceBroker} from 'moleculer';
import {Socket} from 'net';

import {IServiceSchemaOptions, ServiceSchema} from '../../ServiceSchema';

// tslint:disable
const uuid = require("uuid/v4");

// tslint:enable

export interface ISessionServiceSettings {
    uuid: string;
}

interface ISessionServiceOptions extends IServiceSchemaOptions {
    socket: Socket;
}

export interface IMessage {
    sessionUUID: string;
    messageUUID: string;
    rawText: string;
    timestamp: Date;
    remoteAddress: string;
}

/**
 * The SessionService handles incoming connections and creates the player service for the connection.
 */
export class SessionService extends ServiceSchema {
    public serviceSettings: ISessionServiceSettings;
    public settings: ISessionServiceSettings;
    public socket: Socket;

    get methods() {
        return {
            processInput: this.processInput,
        };
    }

    get actions() {
        return {
            sendToScreen: this.sendToScreen,
        };
    }

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

    public processInput(rawText: string): IMessage {
        return {
            rawText,
            sessionUUID: this.settings.uuid,
            messageUUID: uuid(),
            remoteAddress: this.socket.remoteAddress,
            timestamp: new Date(),
        };
    }

    public sendToScreen(ctx: Context) {
        this.logger.debug(`received message ${ctx.params.message}`);
        this.socket.write(ctx.params.message);
    }

    public schema() {
        const schema = super.schema();

        return {...schema, ...{created: this.created()}};
    }
}
