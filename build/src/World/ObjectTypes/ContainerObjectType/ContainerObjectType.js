"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash = require("lodash");
const validate = require("validate.js");
const ObjectType_1 = require("../ObjectType");
const EventedObjectType_1 = require("../EventedObjectType");
let ContainerObjectType = class ContainerObjectType extends ObjectType_1.ObjectType {
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
    remove(pathOrObject) {
        let object;
        if (typeof pathOrObject === "object") {
            object = pathOrObject;
        }
        else {
            const objectPath = `${pathOrObject.replace(".", ".objects.")}`;
            object = lodash.get(this.objects, objectPath);
        }
        object.parent.emit("objectRemoved", object);
        delete object.parent.objects[object.key];
    }
    on() { }
    emit() { }
    serialize() {
        const objects = {};
        lodash.forEach(this.objects, (value, key) => {
            objects[key] = value.serialize();
        });
        return Object.assign({}, validate.cleanAttributes(this, this.constructor.schema), { objects });
    }
};
ContainerObjectType.schema = {
    objects: {
        presence: true,
    },
};
ContainerObjectType = tslib_1.__decorate([
    ObjectType_1.compose(EventedObjectType_1.EventedObjectType)
], ContainerObjectType);
exports.ContainerObjectType = ContainerObjectType;
//# sourceMappingURL=ContainerObjectType.js.map