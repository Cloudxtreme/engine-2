// tslint:disable-next-line
import {ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {BrokerSchema, IBrokerConfig} from '../BrokerSchema';
import {SessionService} from './SessionService';

// tslint:disable-next-line
export interface IWorldConfig extends IBrokerConfig {}

/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
export class Broker extends BrokerSchema {
    public readonly config: IWorldConfig;
    protected readonly DEFAULT_CONFIG: object = {};

    get SERVICE_NAME() {
        return 'World';
    }

    constructor(config: {} | IWorldConfig = {}) {
        super(config);
        this.beforeStart((broker: ServiceBroker) => (
            broker.createService(new SessionService(broker).schema())
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
