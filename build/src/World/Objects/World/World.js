"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
exports.World = Object_1.Object((data) => (Object.assign({}, data, { object_type: 'World', key: 'world', updated_at: new Date(), live: true, destroyable: false, objects: {} })));
//# sourceMappingURL=World.js.map