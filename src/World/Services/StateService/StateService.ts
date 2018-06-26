import * as Bluebird from "bluebird";
import * as Redis from "redis";

import { define, dependency, onCreate } from "../../../Service";

Bluebird.promisifyAll(Redis);

export const StateService = define(
    "state",
    dependency("services.snapshots"),
    onCreate(function() {
        this.logger.info("connecting to redis instance");
        this.redis = Redis.createClient(process.env.REDIS_URL);
        this.logger.info("loading world");
    }),
);
