import {BrokerOptions, ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {IBrokerConfig} from '../Broker';
import {AppManager} from './AppManager';
import {Object} from './DataServices/Object';
import {Player} from './DataServices/Player';
import {Snapshot} from './DataServices/Snapshot';
import {State} from './State';
import {WorldLoop} from './WorldLoop';
import {ObjectService} from './Objects/ObjectService';

export interface IWorldConfig extends IBrokerConfig {
    name?: string;
}

export const DEFAULT_CONFIG: IWorldConfig = {
    redis: 'redis://localhost:6379',
    transporter: 'redis://localhost:6379',
};

// tslint:disable-next-line:no-object-literal-type-assertion
export const World: Function = (options: IWorldConfig = <IWorldConfig>{}): BrokerOptions => {
    const config = {...DEFAULT_CONFIG, ...options};

    return {
        nodeID: 'lucid-world',
        transporter: config.transporter,
        validation: true,
        logLevel: 'debug',
        heartbeatInterval: 0.5,
        created: (broker: ServiceBroker) => {
            // broker.createService(WorldLoop(config));
            broker.createService(AppManager(config));

            // load data services
            broker.createService(Player(config));
            broker.createService(Snapshot(config));
            broker.createService(Object(config));

            //load world state
            broker.createService(State(config));
            broker.createService(ObjectService(config));
        },
    };
};
