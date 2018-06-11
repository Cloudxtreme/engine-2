"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ContainerObjectType_1 = require("../ContainerObjectType");
const ObjectType_1 = require("../ObjectType");
const ServiceObjectType_1 = require("../ServiceObjectType");
let WorldObjectType = class WorldObjectType extends ObjectType_1.ObjectType {
    initialize() {
        this.key = "world";
    }
    created() {
        this.logger.debug("preparing world");
    }
    add() { }
    remove() { }
    emit() { }
    on() { }
};
WorldObjectType = tslib_1.__decorate([
    ObjectType_1.compose(ContainerObjectType_1.ContainerObjectType, ServiceObjectType_1.ServiceObjectType)
], WorldObjectType);
exports.WorldObjectType = WorldObjectType;
//# sourceMappingURL=WorldObjectType.js.map