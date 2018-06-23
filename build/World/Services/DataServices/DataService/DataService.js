"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const Service_1 = require("../../../../Service");
exports.DataService = Service_1.Service.define("data", Service_1.Service.onCreate(function () {
    this.logger.debug("connecting to database");
    this.knex = Knex(
    // tslint:disable-next-line:non-literal-require
    require(`${process.env.GAME_ROOT}/config/knexfile.js`));
}));
