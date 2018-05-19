"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird = require("bluebird");
const redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const ObjectTypes_1 = require("../../ObjectTypes");
exports.StateService = (config) => ({
    name: 'world.state',
    metadata: Object.assign({}, config),
    dependencies: ['data.snapshot'],
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
        this.logger.debug('loading initial world state');
        this.broker.call('data.snapshot.getLatest')
            .then((state) => {
            if (!state) {
                this.logger.warn('no existing snapshot');
                return this.newWorld()
                    .then((world) => {
                    this.logger.warn('creating initial snapshot');
                    return this.broker.call('data.snapshot.create', world);
                });
            }
            this.logger.info(`loading world from snapshot '${state.created_at}'`);
            return ObjectTypes_1.WorldObjectType(Object.assign({}, state, state.data));
        })
            .then((world) => this.liveLoad(world))
            .then((world) => {
            this.redis.set('lucid.state', JSON.stringify(world));
            this.logger.info('world loading complete');
        });
    },
    methods: {
        newWorld() {
            this.logger.warn('constructing new world');
            return this.broker.call('world.objects.buildAndCreate', ObjectTypes_1.WorldObjectType({}));
        },
        liveLoad(object) {
            if (object.live) {
                this.logger.debug(`starting live service for '${object.object_type}.${object.uuid}'`);
                this.broker.createService({
                    name: `world.objects.${object.uuid}`,
                });
            }
            this.logger.debug(`indexing '${object.key}'`);
            this.redis.hset('lucid.objectIndex', object.key, object.uuid);
            return object;
        },
    },
});
//# sourceMappingURL=StateService.js.map