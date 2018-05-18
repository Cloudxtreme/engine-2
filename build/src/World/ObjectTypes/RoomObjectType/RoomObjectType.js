"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../ObjectType");
exports.RoomObjectType = ObjectType_1.ObjectType((data) => (Object.assign({}, data, { live: true, object_type: 'Room', destroyable: false, updateOnRestart: true })));
//# sourceMappingURL=RoomObjectType.js.map