"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird = require("bluebird");
const redis = require("redis");
const uuid = require("uuid");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const World_1 = require("../Objects/World");
exports.State = (config) => ({
    name: 'world.state',
    metadata: Object.assign({}, config),
    dependencies: ['data.snapshot'],
    actions: {
        createAndStore(ctx) {
        },
    },
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
        this.logger.debug('loading initial world state');
        this.broker.call('data.snapshot.getLatest')
            .then((state) => {
            let worldState;
            if (!state) {
                this.logger.warn('no existing snapshot');
                worldState = this.newWorld();
                this.logger.warn('creating initial snapshot');
                return this.broker.call('data.snapshot.create', worldState);
            }
            this.logger.info(`loading world from snapshot '${state.created_at}'`);
            return World_1.World(state);
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
            return World_1.World({
                uuid: uuid.v1(),
                created_at: new Date(),
                updated_at: new Date(),
            });
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
//# sourceMappingURL=State.js.map