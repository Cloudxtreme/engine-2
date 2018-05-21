"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const ObjectType_1 = require("../ObjectType");
let WorldObjectType = (data) => (Object.assign({}, data, { object_type: 'World', key: 'world', updated_at: new Date(), live: true, destroyable: false, objects: {} }));
exports.WorldObjectType = WorldObjectType;
exports.WorldObjectType = WorldObjectType = utils_1.compose(ObjectType_1.ObjectType, WorldObjectType);
//# sourceMappingURL=WorldObjectType.js.map