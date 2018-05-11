"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataService_1 = require("../DataService");
exports.Snapshot = DataService_1.DataService(() => ({
    name: 'snapshot',
    create(data) {
        return this.db.insert({
            data: data,
        })
            .into('snapshots');
    },
    actions: {
        getLatest() {
            return this.db.select()
                .from('snapshots')
                .orderBy('created_at', 'desc')
                .first()
                .then((data) => {
                if (!data) {
                    return false;
                }
                return data;
            });
        },
    },
}));
//# sourceMappingURL=Snapshot.js.map