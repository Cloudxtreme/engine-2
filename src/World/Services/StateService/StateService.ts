import * as Bluebird from "bluebird";
import * as Redis from "redis";

import { define, dependency, method, onCreate, onStart } from "../../../Service";
import { IWorldObject, WorldObjectType } from "../../ObjectTypes/WorldObjectType";
import { ISnapshot } from "../DataServices/SnapshotDataService";

Bluebird.promisifyAll(Redis);

export const StateService = define(
    "state",
    dependency("services.snapshots"),
    onCreate(function() {
        this.logger.info("connecting to redis instance");
        this.redis = Redis.createClient(process.env.REDIS_URL);
        this.logger.info("loading world");
    }),
    onStart(function() {
        return this.broker.call("services.snapshots.findLatest")
            .then((latest: ISnapshot) => {
                if (!latest) {
                    this.logger.warn("snapshot not found, bootstrapping new world");
                }
                this.logger.info(`loaded snapshot '${latest.created_at.getTime()}'`);
                this.loadState()
                    .then((state: IWorldObject) => {
                        if (state) {
                            this.logger.debug(`current state was last updated at '${state.updatedAt}'`);
                            if (state.updatedAt > latest.data.updatedAt) {
                                this.logger
                                    .warn("current state is newer than the last snapshot, using current state");

                                return this.broker.call("services.snapshots.create", state);
                            } else {
                                this.setState(latest.data);
                            }
                        } else {
                            this.logger.debug("no current state has been stored, setting current state to snapshot");

                            this.setState(latest.data);
                        }
                    });

            });
    }),
    method("boostrapWorld", function() {
        const world = new WorldObjectType({
            name: "world",
        })
    }),
    method("loadState", function(): IWorldObject {
        this.logger.debug("loading state from Redis");

        return this.redis.getAsync("lucid.world")
            .then((json: string) => {
                if (json) {
                    return JSON.parse(json);
                }

                return null;
            });
    }),
    method("setState", function(state: IWorldObject) {
        this.logger.debug("setting state in Redis");

        return this.redis.setAsync("lucid.world", JSON.stringify(state))
            .then(() => {
                return state;
            });
    }),
);
