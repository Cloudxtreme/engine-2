import {BrokerOptions} from "moleculer";

export interface IWorldConfig {
    transporter?: string;
    logLevel?: string;
}

/**
 * The World process runs the actual implementation of the game. It is a Moleculer broker process that spins up the
 * various services required to run the game world. It can be configured by passing in the configuration values to the
 * function.
 */
export const World = (config: IWorldConfig = {}): BrokerOptions => {
    return {
        nodeID: "lucid-mud",
        transporter: config.transporter || "nats://localhost:4222",
        logger: console,
        logLevel: config.logLevel || "debug",
    };
};
