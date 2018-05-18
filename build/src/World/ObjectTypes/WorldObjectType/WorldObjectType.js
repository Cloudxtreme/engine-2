"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../ObjectType");
exports.WorldObjectType = ObjectType_1.ObjectType((data) => (Object.assign({}, data, { object_type: 'World', key: 'world', updated_at: new Date(), live: true, destroyable: false, objects: {} })));
//# sourceMappingURL=WorldObjectType.js.map