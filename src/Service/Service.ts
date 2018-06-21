import * as Bluebird from "bluebird";
import { ServiceBroker, ServiceSchema } from "moleculer";
import * as R from "ramda";

export interface IServiceProps {
    name?: string;
    created?: TServiceCreatedFunction;
    started?: TServiceLifeCycleFunction;
    stopped?: TServiceLifeCycleFunction;
}

type TServiceCreatedFunction = (broker: ServiceBroker) => void;
type TServiceLifeCycleFunction = () => Bluebird<void>;
type TServicePropsFunction = (props: IServiceProps) => IServiceProps;

export const Service = {
    definition(props: IServiceProps): ServiceSchema {
        return R.pipe((p: IServiceProps) => p)(props);
    },

    /**
     * adds the function as a callback for when the Service is created. This can be called multiple times to add
     * multiple created callbacks
     * @param cb the cb to fire when the service is created
     */
    onCreate(cb: TServiceCreatedFunction): TServicePropsFunction {
        return R.ifElse(
            R.pipe(
                R.prop("created"),
                R.isNil,
            ),
            R.assoc("created", cb),
            R.pipe((props: IServiceProps) => {
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
            R.pipe((props: IServiceProps) => {
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
            R.pipe((props: IServiceProps) => {
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
