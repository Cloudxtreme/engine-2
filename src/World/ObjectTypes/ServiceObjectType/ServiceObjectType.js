const Bluebird = require("bluebird");
const lodash = require("lodash");

const { combine } = require("../ObjectType");
const { EventedObjectType } = require("../EventedObjectType");

let ServiceObjectType = traits => {
    return {
        get name() {
            return this.key;
        },
        methods: {},
        events: {},
        ...traits,
        beforeValidate(t) {
            lodash.keys(traits, key => {
                if (typeof traits[key] === "function") {
                    this.methods[key] = traits[key].bind(this);
                }
            });
            t.events[`object.${this.key}.*`] = (payload, _, eventName) => {
                this.emit(eventName.split('.')[-1], {payload})
            };
            return Bluebird.resolve(t)
        },
        afterValidate() {
            global.broker.createService(this)
        }
    };
};

module.exports.ServiceObjectType = combine(EventedObjectType, ServiceObjectType);
