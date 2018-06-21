import * as Bluebird from "bluebird";
import { ServiceBroker, ServiceSchema } from "moleculer";
import * as R from "ramda";

export interface IServiceConfig {
    name?: string;
    created?: TServiceCreatedFunction;
    started?: TServiceLifeCycleFunction;
    stopped?: TServiceLifeCycleFunction;
}

type TServiceCreatedFunction = (broker: ServiceBroker) => void;
type TServiceLifeCycleFunction = () => Bluebird<void>;
type TServicePropsFunction = (props: IServiceConfig) => IServiceConfig;
export type TServiceDefinition = (config?: IServiceConfig | {}) => ServiceSchema;

export const Service = {
    /**
     * Creates a service definition. May be used by the World process config to create services.
     */
    define(name: string, ...definition: Function[]): TServiceDefinition {
        return (config: IServiceConfig = {}): ServiceSchema =>
            R.pipe(
                R.assoc("name", `services.${name}`),
                ...definition,
            )(config);
    },

    /**
     * adds the function as a callback for when the Service is created. This can be called multiple times to add
     * multiple created callbacks
     */
    onCreate(cb: TServiceCreatedFunction): TServicePropsFunction {
        return R.ifElse(
            R.pipe(
                R.prop("created"),
                R.isNil,
            ),
            R.assoc("created", cb),
            R.pipe((props: IServiceConfig) => {
                const created: TServiceCreatedFunction = R.pipe(
                    R.prop("created"),
                    (c1: TServiceCreatedFunction) => (
                        broker: ServiceBroker,
                    ) => {
                        c1(broker);
                        cb(broker);
                    },
                )(props);

                return R.assoc("created", created)(props);
            }),
        );
    },

    /**
     * adds the function as a callback to be fired when the Service is started. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStart(cb: TServiceLifeCycleFunction): TServicePropsFunction {
        return <TServicePropsFunction>R.ifElse(
            R.pipe(
                R.prop("started"),
                R.isNil,
            ),
            R.assoc("started", cb),
            R.pipe((props: IServiceConfig) => {
                const started = R.pipe(
                    R.prop("started"),
                    (
                        c1: TServiceLifeCycleFunction,
                    ): TServiceLifeCycleFunction => (): Bluebird<void> =>
                        c1().then(cb),
                )(props);

                return R.assoc("started", started)(props);
            }),
        );
    },

    /**
     * adds the function as a callback to be fired when the Service is stopped. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStop(cb: TServiceLifeCycleFunction): TServicePropsFunction {
        return <TServicePropsFunction>R.ifElse(
            R.pipe(
                R.prop("stopped"),
                R.isNil,
            ),
            R.assoc("stopped", cb),
            R.pipe((props: IServiceConfig) => {
                const stopped = R.pipe(
                    R.prop("stopped"),
                    (
                        c1: TServiceLifeCycleFunction,
                    ): TServiceLifeCycleFunction => (): Bluebird<void> =>
                        c1().then(cb),
                )(props);

                return R.assoc("stopped", stopped)(props);
            }),
        );
    },
};
