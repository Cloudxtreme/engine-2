"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataService_1 = require("../DataService");
exports.Snapshot = DataService_1.DataService(() => ({
    name: 'snapshot',
    create(data) {
        this.db.insert({
            createdAt: new Date().getTime() / 1000,
            data: data,
        })
            .into('snapshots');
    },
}));
//# sourceMappingURL=Object.js.map