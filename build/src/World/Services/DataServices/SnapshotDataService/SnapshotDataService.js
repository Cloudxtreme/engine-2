"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../DataService/index");
exports.SnapshotDataService = index_1.DataService(() => ({
    name: "snapshot",
    create(data) {
        return this.db
            .insert({
            data: data,
        })
            .into("snapshots")
            .then(() => {
            return data;
        });
    },
    actions: {
        getLatest() {
            return (this.db
                .select()
                .from("snapshots")
                .orderBy("created_at", "desc")
                .first()
                .then((data) => {
                if (!data) {
                    return false;
                }
                return data;
            }));
        },
    },
}));
//# sourceMappingURL=SnapshotDataService.js.map