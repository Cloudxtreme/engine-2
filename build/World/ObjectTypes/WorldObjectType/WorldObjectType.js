"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerObjectType_1 = require("../ContainerObjectType");
const ObjectType_1 = require("../ObjectType");
const ServiceObjectType_1 = require("../ServiceObjectType");
exports.WorldObjectType = function (object = {}) {
    return ObjectType_1.ObjectType("WorldObject", ContainerObjectType_1.ContainerObjectType, ServiceObjectType_1.ServiceObjectType)(object);
};
