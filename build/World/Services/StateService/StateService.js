"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Redis = require("redis");
const Service_1 = require("../../../Service");
Bluebird.promisifyAll(Redis);
exports.StateService = Service_1.Service.define("state", Service_1.Service.dependency("services.snapshots"), Service_1.Service.onCreate(function () {
    this.logger.info("connecting to redis instance");
    this.redis = Redis.createClient(process.env.REDIS_URL);
}));
