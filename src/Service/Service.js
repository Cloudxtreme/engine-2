const R = require("ramda");

const Service = props => props;

/**
 * adds the function as a callback for when the Service is created. This can be called multiple times to add multiple
 * created callbacks
 * @param cb the cb to fire when the service is created
 * @returns {Function}
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
 * sets the Service name
 * @param name the name to set for the service
 */
Service.setName = name => R.assoc("name", name);

module.exports = Service;
