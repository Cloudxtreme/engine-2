import * as bluebird from 'bluebird';
import {Context, ServiceSchema} from 'moleculer';
import * as redis from 'redis';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

import {
    IObject,
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
                this.logger.info('world loading complete');
            });
    },
    methods: {
        newWorld(): IObject {
            this.logger.warn('constructing new world');

            return this.broker.call('world.objects.buildAndCreate', WorldObjectType({}));
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
