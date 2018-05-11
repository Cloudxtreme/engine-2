"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataService_1 = require("../DataService");
exports.Object = DataService_1.DataService(() => ({
    name: 'object',
    create(object) {
        return this.db.insert(object)
            .into('objects');
    },
}));
//# sourceMappingURL=Object.js.map