// tslint:disable-next-line
import {Service, ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {BrokerSchema, IBrokerConfig} from '../BrokerSchema';
import {TelnetService} from './TelnetService';

/**
 * Portal configuration
 */
export interface IPortalConfig {
    /**
     * The host the portal should listen on. Use 0.0.0.0 to listen on all interfaces.
     */
    host: string;
}

/**
 * The Portal provides the connection between the player's MUD client and the World. It proxies all incoming date from
 * the player client to the World and all data from the world to the player client. It is also handles telnet
 * negotiation and various pre-output or pre-input middlewares.
 */
export class Portal extends BrokerSchema {

    protected readonly DEFAULT_CONFIG: IPortalConfig = {
        host: 'tcp://0.0.0.0:2323',
    };
    protected readonly PROCESS_NAME: string = 'Portal';
    protected readonly config: IBrokerConfig & IPortalConfig;

    constructor(config: {} | IBrokerConfig & IPortalConfig = {}) {
        super(config);
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
