"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Redis = require("redis");
const Service_1 = require("../../../Service");
const WorldObjectType_1 = require("../../ObjectTypes/WorldObjectType");
Bluebird.promisifyAll(Redis);
exports.StateService = Service_1.define("state", Service_1.dependency("services.snapshots"), Service_1.onCreate(function () {
    this.logger.info("connecting to redis instance");
    this.redis = Redis.createClient(process.env.REDIS_URL);
    this.logger.info("loading world");
}), Service_1.onStart(function () {
    return this.broker.call("services.snapshots.findLatest")
        .then((latest) => {
        if (!latest) {
            this.logger.warn("snapshot not found, bootstrapping new world");
        }
        this.logger.info(`loaded snapshot '${latest.created_at.getTime()}'`);
        this.loadState()
            .then((state) => {
            if (state) {
                this.logger.debug(`current state was last updated at '${state.updatedAt}'`);
                if (state.updatedAt > latest.data.updatedAt) {
                    this.logger
                        .warn("current state is newer than the last snapshot, using current state");
                    return this.broker.call("services.snapshots.create", state);
                }
                else {
                    this.setState(latest.data);
                }
            }
            else {
                this.logger.debug("no current state has been stored, setting current state to snapshot");
                this.setState(latest.data);
            }
        });
    });
}), Service_1.method("boostrapWorld", function () {
    const world = new WorldObjectType_1.WorldObjectType({
        name: "world",
    });
}), Service_1.method("loadState", function () {
    this.logger.debug("loading state from Redis");
    return this.redis.getAsync("lucid.world")
        .then((json) => {
        if (json) {
            return JSON.parse(json);
        }
        return null;
    });
}), Service_1.method("setState", function (state) {
    this.logger.debug("setting state in Redis");
    return this.redis.setAsync("lucid.world", JSON.stringify(state))
        .then(() => {
        return state;
    });
}));
