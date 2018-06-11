"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require("../");
let WorldObjectType = class WorldObjectType extends _1.ObjectType {
    created(broker) {
        broker.logger.debug("preparing world");
    }
    add() { }
    remove() { }
    emit() { }
    on() { }
};
WorldObjectType = tslib_1.__decorate([
    _1.compose(_1.ContainerObjectType, _1.ServiceObjectType)
], WorldObjectType);
exports.WorldObjectType = WorldObjectType;
//# sourceMappingURL=WorldObjectType.js.map