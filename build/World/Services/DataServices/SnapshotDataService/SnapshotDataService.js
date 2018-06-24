"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../../../Service");
const DataService_1 = require("../DataService");
exports.SnapshotDataService = Service_1.Service.define("snapshots", DataService_1.DataService, Service_1.Service.method("findLatest", function () {
    return this.knex
        .select("*")
        .from("snapshots")
        .orderBy("created_at", "desc")
        .limit(1)
        .then((rows) => {
        return rows[0];
    });
}));
