import {BrokerOptions, ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {IBrokerConfig} from '../Broker';
import {AppManagerService} from './Services/AppManagerService';
import {ObjectDataService} from './Services/DataServices/ObjectDataService';
import {PlayerDataService} from './Services/DataServices/PlayerDataService';
import {SnapshotDataService} from './Services/DataServices/SnapshotDataService';
import {ObjectService} from './Services/ObjectService';
import {StateService} from './Services/StateService';
import {WorldLoop} from './Services/WorldLoop';

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
            broker.createService(AppManagerService(config));

            // load data services
            broker.createService(PlayerDataService(config));
            broker.createService(SnapshotDataService(config));
            broker.createService(ObjectDataService(config));

            //load world state
            broker.createService(StateService(config));
            broker.createService(ObjectService(config));
        },
    };
};
