"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectTraits_1 = require("../../ObjectTraits");
const ObjectType_1 = require("../ObjectType");
let WorldObjectType = class WorldObjectType extends ObjectType_1.ObjectType {
    constructor() {
        super(...arguments);
        this.key = "world";
    }
};
WorldObjectType = tslib_1.__decorate([
    ObjectType_1.traits(ObjectTraits_1.ContainerObjectTrait, ObjectTraits_1.ServiceObjectTrait)
], WorldObjectType);
exports.WorldObjectType = WorldObjectType;
//# sourceMappingURL=WorldObjectType.js.map