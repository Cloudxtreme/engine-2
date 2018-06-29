"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../../../Service");
const DataService_1 = require("../DataService");
exports.SnapshotDataService = Service_1.define("snapshots", DataService_1.DataService, Service_1.method("findLatest", function () {
    this.logger.debug("finding latest snapshot");
    return this.knex
        .select("*")
        .from("snapshots")
        .orderBy("created_at", "desc")
        .limit(1)
        .then((rows) => {
        return rows[0];
    });
}), Service_1.method("create", function (snapshot) {
    this.logger.debug("saving snapshot");
    return this.knex
        .returning("id")
        .insert({ data: snapshot })
        .into("snapshots")
        .then((rows) => this.knex
        .select("*")
        .from("snapshots")
        .where({ id: rows[0] }))
        .then((rows) => rows[0]);
}), Service_1.action("findLatest", function () {
    return this.findLatest();
}), Service_1.action("create", function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(ctx.params);
        return this.create(ctx.params);
    });
}));
