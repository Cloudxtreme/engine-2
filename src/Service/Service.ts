import * as Bluebird from "bluebird";
import { Action, Context, ServiceBroker, ServiceSchema } from "moleculer";
import * as R from "ramda";

export interface IServiceConfig {
    name?: string;
    created?: TServiceCreatedFunction;
    started?: TServiceLifeCycleFunction;
    stopped?: TServiceLifeCycleFunction;
}

type TServiceCreatedFunction = (broker: ServiceBroker) => void;
type TServiceLifeCycleFunction = () => Bluebird<void>;
type TServiceConfigFunction = (config: IServiceConfig) => ServiceSchema;
type TServiceActionFunction = (ctx: Context) => any;

export type TServiceDefinition = (config?: IServiceConfig | {}) => ServiceSchema;

/**
 * Creates a service definition. May be used by the World process config to create services.
 */
export const define = function(name: string, ...definition: Function[]): TServiceDefinition {
    return (config: IServiceConfig = {}): ServiceSchema =>
        R.compose(
            R.assoc("name", `services.${name}`),
            ...definition,
        )(config);
};

/**
 * add an action
 */
export const action = function(name: string, func: TServiceActionFunction): TServiceConfigFunction {
    return R.assocPath(["actions", name], func);
};

/**
 * Adds the given service dependency
 */
export const dependency = function(name: string): TServiceConfigFunction {
    return (config: IServiceConfig): ServiceSchema =>
        R.assoc(
            "dependencies",
            R.pipe(
                R.prop("dependencies"),
                R.defaultTo([]),
                R.append(name),
            )(config),
        )(config);
};

/**
 * adds a method to the service
 */
export const method = function(name: string, func: Function): TServiceConfigFunction {
    return R.assocPath(["methods", name], func);
};

/**
 * adds the function as a callback for when the Service is created. This can be called multiple times to add
 * multiple created callbacks
 */
export const onCreate = function(cb: TServiceCreatedFunction): TServiceConfigFunction {
    return R.ifElse(
        R.pipe(
            R.prop("created"),
            R.isNil,
        ),
        R.assoc("created", cb),
        R.pipe((props: IServiceConfig) => {
            const created: TServiceCreatedFunction = R.pipe(
                R.prop("created"),
                (c1: TServiceCreatedFunction) => (broker: ServiceBroker) => {
                    c1(broker);
                    cb(broker);
                },
            )(props);

            return R.assoc("created", created)(props);
        }),
    );
};

/**
 * adds the function as a callback to be fired when the Service is started. Multiple callbacks will be chained
 * together. Expects the function to return a promise.
 */
export const onStart = function(cb: TServiceLifeCycleFunction): TServiceConfigFunction {
    return <TServiceConfigFunction>R.ifElse(
        R.pipe(
            R.prop("started"),
            R.isNil,
        ),
        R.assoc("started", cb),
        R.pipe((props: IServiceConfig) => {
            const started = R.pipe(
                R.prop("started"),
                (c1: TServiceLifeCycleFunction): TServiceLifeCycleFunction => (): Bluebird<void> => c1().then(cb),
            )(props);

            return R.assoc("started", started)(props);
        }),
    );
};

/**
 * adds the function as a callback to be fired when the Service is stopped. Multiple callbacks will be chained
 * together. Expects the function to return a promise.
 */
export const onStop = function(cb: TServiceLifeCycleFunction): TServiceConfigFunction {
    return <TServiceConfigFunction>R.ifElse(
        R.pipe(
            R.prop("stopped"),
            R.isNil,
        ),
        R.assoc("stopped", cb),
        R.pipe((props: IServiceConfig) => {
            const stopped = R.pipe(
                R.prop("stopped"),
                (c1: TServiceLifeCycleFunction): TServiceLifeCycleFunction => (): Bluebird<void> => c1().then(cb),
            )(props);

            return R.assoc("stopped", stopped)(props);
        }),
    );
};
