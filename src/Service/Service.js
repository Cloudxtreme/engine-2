"use strict";
exports.__esModule = true;
var R = require("ramda");
exports.Service = {
    definition: function (props) {
        return R.pipe(function (p) { return p; })(props);
    },
    /**
     * adds the function as a callback for when the Service is created. This can be called multiple times to add
     * multiple created callbacks
     * @param cb the cb to fire when the service is created
     */
    onCreate: function (cb) {
        return R.ifElse(R.pipe(R.prop("created"), R.isNil), R.assoc("created", cb), R.pipe(function (props) {
            var created = R.pipe(R.prop("created"), function (c1) { return function (broker) {
                c1(broker);
                cb(broker);
            }; })(props);
            return R.assoc("created", created)(props);
        }));
    },
    /**
     * adds the function as a callback to be fired when the Service is started. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStart: function (cb) {
        return R.ifElse(R.pipe(R.prop("started"), R.isNil), R.assoc("started", cb), R.pipe(function (props) {
            var started = R.pipe(R.prop("started"), function (c1) { return function () {
                return c1().then(cb);
            }; })(props);
            return R.assoc("started", started)(props);
        }));
    },
    /**
     * adds the function as a callback to be fired when the Service is stopped. Multiple callbacks will be chained
     * together. Expects the function to return a promise.
     */
    onStop: function (cb) {
        return R.ifElse(R.pipe(R.prop("stopped"), R.isNil), R.assoc("stopped", cb), R.pipe(function (props) {
            var stopped = R.pipe(R.prop("stopped"), function (c1) { return function () {
                return c1().then(cb);
            }; })(props);
            return R.assoc("stopped", stopped)(props);
        }));
    }
};
