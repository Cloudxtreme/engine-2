"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
exports.Service = {
    definition(props) {
        return R.pipe((p) => p)(props);
    },
    /**
     * adds the function as a callback for when the Service is created. This can be called multiple times to add
     * multiple created callbacks
     * @param cb the cb to fire when the service is created
     */
    onCreate(cb) {
        return R.ifElse(R.pipe(R.prop("created"), R.isNil), R.assoc("created", cb), R.pipe((props) => {
            const created = R.pipe(R.prop("created"), (c1) => (broker) => {
                c1(broker);
                cb(broker);
            })(props);
            return R.assoc("created", created)(props);
        }));
    },
    /**
     * adds the function as a callback to be fired when the Service is started. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStart(cb) {
        return R.ifElse(R.pipe(R.prop("started"), R.isNil), R.assoc("started", cb), R.pipe((props) => {
            const started = R.pipe(R.prop("started"), (c1) => () => c1().then(cb))(props);
            return R.assoc("started", started)(props);
        }));
    },
    /**
     * adds the function as a callback to be fired when the Service is stopped. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStop(cb) {
        return R.ifElse(R.pipe(R.prop("stopped"), R.isNil), R.assoc("stopped", cb), R.pipe((props) => {
            const stopped = R.pipe(R.prop("stopped"), (c1) => () => c1().then(cb))(props);
            return R.assoc("stopped", stopped)(props);
        }));
    },
};