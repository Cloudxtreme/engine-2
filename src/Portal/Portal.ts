import {
    BrokerOptions,
    ServiceBroker,
} from 'moleculer';

import {IBrokerConfig} from '../Broker';
import {VERSION} from '../version';
import {TelnetService} from './TelnetService';

export interface IPortalConfig extends IBrokerConfig {
    host?: string;
}

export const DEFAULT_CONFIG: IPortalConfig = {
    redis: 'redis://localhost:6379',
    host: 'tcp://localhost:2323',
};

// tslint:disable-next-line:no-object-literal-type-assertion
export const Portal: Function = (options: IPortalConfig = <IPortalConfig>{}): BrokerOptions => {
    const config = {...DEFAULT_CONFIG, ...options};
    //tslint:disable-next-line:no-console
    console.log(`Starting Lucid Portal - v${VERSION}`);

    return {
        nodeID: 'lucid-portal',
        transporter: config.redis,
        created(broker: ServiceBroker) {
            if (config.created) {
                config.created.bind(this)(broker);
            }
            broker.createService(TelnetService(config));
        },
        started(broker: ServiceBroker) {
            if (config.started) {
                config.started.bind(this)(broker);
            }
        },
        stopped(broker: ServiceBroker) {
            if (config.stopped) {
                config.stopped.bind(this)(broker);
            }
        },
        validation: true,
    };
};
