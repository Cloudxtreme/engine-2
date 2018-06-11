"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const _1 = require("../");
const ObjectTypes_1 = require("../../ObjectTypes");
let ContainerObjectTrait = function (Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.objects = {};
        }
        add(pathOrObject, object) {
            let parent;
            let objectPath;
            if (typeof pathOrObject === "object") {
                parent = this;
                object = pathOrObject;
                objectPath = object.key;
            }
            else {
                objectPath = `${pathOrObject.replace(".", ".objects.")}`;
                parent = lodash.get(this.objects, objectPath);
                objectPath = `${objectPath}.objects.${object.key}`;
            }
            object.parent = parent;
            lodash.set(this.objects, objectPath, object);
            object.parent.emit("objectAdded", object);
        }
    };
};
exports.ContainerObjectTrait = ContainerObjectTrait;
exports.ContainerObjectTrait = ContainerObjectTrait = ObjectTypes_1.traits(_1.EventEmitterObjectTrait, ContainerObjectTrait);
//# sourceMappingURL=ContainerObjectTrait.js.map