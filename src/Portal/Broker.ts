// tslint:disable-next-line
import {ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {BrokerSchema, IBrokerConfig} from '../BrokerSchema';
import {TelnetService} from './TelnetService';

export interface IPortalConfig extends IBrokerConfig {
    host: string;
}

/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
export class Broker extends BrokerSchema {
    get DEFAULT_CONFIG() {
        return {
            host: 'tcp://0.0.0.0:2323',
        };
    }

    get SERVICE_NAME() {
        return 'Portal';
    }

    public readonly config: IPortalConfig;

    constructor(config: {} | IPortalConfig = {}) {
        super(config);
        // set the telnet service to start up after the broker has started
        this.beforeStart((broker: ServiceBroker) => (
            broker.createService(new TelnetService(broker, {settings: this.config}).schema())
        ));
        if (process.env.NODE_ENV !== 'test') {
            // tslint:disable
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n")
            //tslint:enable
        }
    }
}
