"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const glob = require("glob-fs");
const path = require("path");
const g = glob();
const redis = require("redis");
Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);
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
        })
            .then(() => (this.loadRooms()))
            .then(() => this.logger.info('world loading complete'))
            .catch((e) => {
            this.logger.fatal(e);
            process.exit(1);
        });
    },
    methods: {
        newWorld() {
            this.logger.warn('constructing new world');
            return this.broker.call('world.objects.buildAndCreate', ObjectTypes_1.WorldObjectType({}));
        },
        loadRooms() {
            this.logger.info('registering rooms with object service');
            return g.readdirPromise('rooms/*.js')
                .then((files) => {
                return Promise.all(files.map((file) => {
                    this.logger.info(`registering '${file}'`);
                    return this.broker.call('world.objects.registerObjectType', { file })
                        .then(() => {
                        return file;
                    });
                }));
            })
                .then((files) => {
                this.logger.info('syncing rooms to object table');
                return Promise.all(files.map((file) => {
                    const t = path.basename(file).replace('.js', '');
                    const room = require(file)();
                    this.logger.debug(`syncing '${room.key}'`);
                    return this.broker.call('world.objects.createOrUpdate', Object.assign({}, room, { object_type: t }));
                }));
            })
                .catch((e) => {
                this.logger.error(e);
                process.exit(1);
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
//# sourceMappingURL=StateService.js.map