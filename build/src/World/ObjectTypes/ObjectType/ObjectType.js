"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const uuid = require("uuid");
const validate = require("validate.js");
class ObjectType {
    constructor(props = {}) {
        this.uuid = props.uuid;
        if (!this.uuid)
            this.uuid = uuid.v1();
        this.objectType = this.constructor.name;
        this.key = props.key;
        if (!this.key) {
            this.key = `${lodash.kebabCase(this.objectType.replace("ObjectType", ""))}:${this.uuid.slice(-5, -1)}`;
        }
        if (this._initialize)
            this._initialize.call(this, props);
        if (this.initialize)
            this.initialize(props);
    }
    serialize() {
        return validate.cleanAttributes(this, this.constructor.schema);
    }
}
ObjectType.schema = {
    uuid: {
        presence: true,
    },
    key: {
        presence: true,
    },
    objectType: {
        presence: true,
    },
};
exports.ObjectType = ObjectType;
exports.compose = (...types) => {
    return (base) => {
        base.traits = {};
        const initializers = [];
        const serializers = [];
        types.forEach((t) => {
            Object.getOwnPropertyNames(t.prototype).forEach((name) => {
                if (!base.prototype[name] && name !== "constructor") {
                    base.prototype[name] = t.prototype[name];
                }
                else if (name === "initialize") {
                    initializers.push(t.prototype[name]);
                }
            });
            base.traits[t.name] = t;
            if (t.schema) {
                base.schema = lodash.merge(Object.assign({}, t.schema, base.schema, ObjectType.schema));
            }
        });
        if (initializers.length > 0) {
            base.prototype._initialize = function (props) {
                return lodash.flowRight(...initializers.map((i) => i.bind(this)))(props);
            };
        }
        return base;
    };
};
//# sourceMappingURL=ObjectType.js.map