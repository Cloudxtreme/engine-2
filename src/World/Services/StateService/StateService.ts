import * as Bluebird from 'bluebird';
import * as glob from 'glob-fs';
import * as path from 'path';

const g = glob();

import {
    ServiceSchema,
} from 'moleculer';
import * as redis from 'redis';

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

import {
    IObject,
    IRoom,
    WorldObjectType,
} from '../../ObjectTypes';
import {IWorldConfig} from '../../World';

export const StateService = (config: IWorldConfig): ServiceSchema => ({
    name: 'world.state',
    metadata: {...config},
    dependencies: ['data.snapshot'],
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
        this.logger.debug('loading initial world state');
        this.broker.call('data.snapshot.getLatest')
        //tslint:disable-next-line
            .then((state: any) => {
                if (!state) {
                    this.logger.warn('no existing snapshot');

                    return this.newWorld()
                        .then((world: IObject) => {
                            this.logger.warn('creating initial snapshot');

                            return this.broker.call('data.snapshot.create', world);
                        });

                }
                this.logger.info(`loading world from snapshot '${state.created_at}'`);

                return WorldObjectType({...state, ...state.data});
            })
            .then((world: IObject) => this.liveLoad(world))
            .then((world: IObject) => {
                this.redis.set('lucid.state', JSON.stringify(world));
            })
            .then(() => (this.loadRooms()))
            .then(() => this.logger.info('world loading complete'))
            .catch((e: Error) => {
                this.logger.fatal(e);

                process.exit(1);
            });
    },
    methods: {
        newWorld(): IObject {
            this.logger.warn('constructing new world');

            return this.broker.call('world.objects.buildAndCreate', WorldObjectType({}));
        },
        loadRooms(): Bluebird<void> {
            this.logger.info('registering rooms with object service');

            return g.readdirPromise('rooms/*.js')
                .then((files: [string]): Bluebird<IRoom[]> => {

                    return Promise.all(files.map((file: string) => {
                        this.logger.info(`registering '${file}'`);

                        return this.broker.call('world.objects.registerObjectType', {file})
                            .then(() => {
                                return file;
                            });
                    }));
                })
                .then((files: string[]): Bluebird<IRoom[]> => {
                    this.logger.info('syncing rooms to object table');

                    return Promise.all(files.map((file: string): Bluebird<IRoom> => {
                        const t = path.basename(file).replace('.js', '');
                        //tslint:disable-next-line:non-literal-require
                        const room = require(file)();
                        this.logger.debug(`syncing '${room.key}'`);

                        return this.broker.call('world.objects.createOrUpdate', {...room, object_type: t});
                    }));
                })
                .catch((e: Error) => {
                    this.logger.error(e);
                    process.exit(1);
                });

        },
        liveLoad(object: IObject) {
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
