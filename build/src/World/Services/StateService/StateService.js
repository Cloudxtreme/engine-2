"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const glob = require("glob-fs");
const objectPath = require("object-path");
const g = glob();
const redis = require("redis");
Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);
const ObjectTypes_1 = require("../../ObjectTypes");
const RoomService_1 = require("./RoomService");
const WorldService_1 = require("./WorldService");
exports.StateService = (config) => ({
    name: 'world.state',
    metadata: Object.assign({}, config),
    dependencies: ['data.snapshot'],
    mixins: [WorldService_1.WorldService, RoomService_1.RoomService],
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
    },
    actions: {
        placeObjectIn(ctx) {
            return this.broker.call('world.state.getIn', { path: `${ctx.params.path}.objects` })
                .then((state) => {
                state[ctx.params.object.key] = ctx.params.object.data;
                return state;
            })
                .then((object) => {
                return this.broker.call('world.state.setIn', { path: `${ctx.params.path}.objects`, object });
            })
                .then(() => {
                this.logger.info(`indexing location of '${ctx.params.object.key}:${ctx.params.object.object_type}'`);
                return this.redis.hsetAsync('lucid.objectLocations', ctx.params.object.key, ctx.params.object.data.location);
            })
                .then(() => {
                if (ctx.params.object.live) {
                    this.liveLoad(ctx.params.object);
                }
            });
        },
        getIn(ctx) {
            this.logger.debug(`loading '${ctx.params.path}' from state`);
            return this.redis.getAsync('lucid.state')
                .then((state) => (objectPath.get(JSON.parse(state), ctx.params.path)));
        },
        setIn(ctx) {
            return this.broker.call('world.state.getIn', { path: 'world' })
                .then((state) => {
                objectPath.set(state, ctx.params.path.replace('world.', ''), ctx.params.object);
                this.redis.set('lucid.state', JSON.stringify({ world: state }));
            });
        },
    },
    methods: {
        newWorld() {
            this.logger.warn('constructing new world');
            return this.broker.call('world.objects.buildAndCreate', ObjectTypes_1.WorldObjectType({}));
        },
        placeObject(object) {
            this.logger.info(`placing '${object.key}:${object.object_type}' into word @ '${object.data.location}'`);
            this.broker.call('world.state.placeObjectIn', { path: object.data.location, object });
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
        create(object) {
            this.logger.info(`creating object '${object.object_type}'`);
        }
    },
});
//# sourceMappingURL=StateService.js.map