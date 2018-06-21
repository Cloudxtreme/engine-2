import { BrokerOptions, ServiceBroker, ServiceSchema } from "moleculer";

export interface IWorldConfig {
    transporter?: string;
    logLevel?: string;
    onCreate?: TBrokerLifeCycleFunction;
    onStart?: TBrokerLifeCycleFunction;
    onStop?: TBrokerLifeCycleFunction;
}

type TBrokerLifeCycleFunction = (broker: ServiceBroker) => void;

/**
 * The World process runs the actual implementation of the game. It is a Moleculer broker process that spins up the
 * various services required to run the game world. It can be configured by passing in the configuration values to the
 * function.
 */
export const World = (config: IWorldConfig = {}): BrokerOptions => {
    const created = (broker: ServiceBroker) => {
        if (config.onCreate) {
            config.onCreate.call(broker);
        }
    };
    const started = (broker: ServiceBroker) => {
        if (config.onStart) {
            config.onStart.call(broker);
        }
    };
    const stopped = (broker: ServiceBroker) => {
        if (config.onCreate) {
            config.onStop.call(broker);
        }
    };

    return {
        nodeID: "lucid-mud",
        transporter: config.transporter || "nats://localhost:4222",
        logger: console,
        logLevel: config.logLevel || "debug",
        created,
        started,
        stopped,
    };
};
