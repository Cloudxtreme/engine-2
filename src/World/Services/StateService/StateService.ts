import * as Bluebird from "bluebird";
import * as Redis from "redis";

import { Service } from "../../../Service";

Bluebird.promisifyAll(Redis);

export const StateService = Service.define(
    "state",
    Service.dependency("services.snapshots"),
    Service.onCreate(function() {
        this.logger.info("connecting to redis instance");
        this.redis = Redis.createClient(process.env.REDIS_URL);
    }),
);
