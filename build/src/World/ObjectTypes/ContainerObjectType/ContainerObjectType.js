"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash = require("lodash");
const _1 = require("../");
let ContainerObjectType = class ContainerObjectType extends _1.ObjectType {
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
};
ContainerObjectType = tslib_1.__decorate([
    _1.compose(_1.EventedObjectType)
], ContainerObjectType);
exports.ContainerObjectType = ContainerObjectType;
//# sourceMappingURL=ContainerObjectType.js.map