import {BrokerOptions, ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {IBrokerConfig} from '../Broker';
import {WorldLoop} from './WorldLoop';

export interface IWorldConfig extends IBrokerConfig {
    name?: string;
}

export const DEFAULT_CONFIG: IWorldConfig = {
    redis: 'redis://localhost:6379',
};

// tslint:disable-next-line:no-object-literal-type-assertion
export const World: Function = (options: IWorldConfig = <IWorldConfig>{}): BrokerOptions => {
    const config = {...DEFAULT_CONFIG, ...options};

    return {
        nodeID: 'lucid-world',
        transporter: config.redis,
        validation: true,
        created: (broker: ServiceBroker) => {
            broker.createService(WorldLoop(config));
        },
    };
};
