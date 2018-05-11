"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
exports.World = Object_1.Object(({ uuid, created_at, data }) => (Object.assign({ uuid, key: 'world', object_type: 'World', created_at, updated_at: new Date() }, data, { live: true })));
//# sourceMappingURL=World.js.map