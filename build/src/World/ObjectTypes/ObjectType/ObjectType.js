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
    }
}
exports.ObjectType = ObjectType;
exports.compose = (...types) => {
    return (base) => {
        const prototype = types.reverse().reduce((r, t) => {
            return lodash.merge(r, t);
        }, {});
        base.prototype = prototype;
        return base;
    };
};
//# sourceMappingURL=ObjectType.js.map