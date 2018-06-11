"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const uuid = require("uuid");
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
        if (this.initialize)
            this.initialize(props);
        if (this._initialize)
            this._initialize.call(this, props);
    }
}
exports.ObjectType = ObjectType;
exports.compose = (...types) => {
    return (base) => {
        base.traits = {};
        const initializers = [];
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
        });
        if (initializers.length > 0) {
            base.prototype._initialize = lodash.flowRight(...initializers);
        }
        return base;
    };
};
//# sourceMappingURL=ObjectType.js.map