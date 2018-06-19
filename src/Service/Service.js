const R = require("ramda");

const Service = props => props;

/**
 * adds the function as a callback for when the Service is created. This can be called multiple times to add multiple
 * created callbacks
 * @param cb the cb to fire when the service is created
 */
Service.onCreate = cb =>
    R.ifElse(
        R.pipe(
            R.prop("created"),
            R.isNil
        ),
        R.assoc("created", cb),
        R.pipe(
            props => {
                const created = R.pipe(
                    R.prop("created"),
                    c1 =>
                        function(broker) {
                            c1(broker);
                            cb(broker);
                        }
                )(props);

                return R.assoc("created", created)(props)
            }
        )
    );

/**
 * adds the function as a callback to be fired when the Service is started. Multiple callbacks will be chained together
 * @param cb the callback to fire when the Service is started
 */
Service.onStart = cb =>
       R.ifElse(
        R.pipe(
            R.prop("started"),
            R.isNil
        ),
        R.assoc("started", cb),
        R.pipe(
            props => {
                const created = R.pipe(
                    R.prop("started"),
                    c1 =>
                        function(broker) {
                            c1(broker);
                            cb(broker);
                        }
                )(props);

                return R.assoc("started", created)(props)
            }
        )
    );

 /**
  * adds the provided callback to the Service to be called when it is stopped.
 * @param cb the callback to fire when the service is stopped.
 */
Service.onStop = cb =>
       R.ifElse(
        R.pipe(
            R.prop("stopped"),
            R.isNil
        ),
        R.assoc("stopped", cb),
        R.pipe(
            props => {
                const created = R.pipe(
                    R.prop("stopped"),
                    c1 =>
                        function(broker) {
                            c1(broker);
                            cb(broker);
                        }
                )(props);

                return R.assoc("stopped", created)(props)
            }
        )
    );

/**
 * sets the Service name
 * @param name the name to set for the service
 */
Service.setName = name => R.assoc("name", name);

module.exports = Service;
