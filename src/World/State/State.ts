import * as bluebird from 'bluebird';
import {Actions, Context, ServiceSchema} from 'moleculer';
import * as redis from 'redis';
import * as uuid from 'uuid';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

import {IObject} from '../Objects/Object';
import {IWorldObject, World} from '../Objects/World';
import {IWorldConfig} from '../World';

export const State = (config: IWorldConfig): ServiceSchema => ({
    name: 'world.state',
    metadata: {...config},
    dependencies: ['data.snapshot'],
    actions: {
        /**
         * Creates an object of the provided objectType and immediately places that object into storage.
         */
        createAndStore(ctx: Context): IObject {

        },
    },
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
        this.logger.debug('loading initial world state');
        this.broker.call('data.snapshot.getLatest')
        //tslint:disable-next-line
            .then((state: any) => {
                let worldState;
                if (!state) {
                    this.logger.warn('no existing snapshot');
                    worldState = this.newWorld();
                    this.logger.warn('creating initial snapshot');

                    return this.broker.call('data.snapshot.create', worldState);
                }
                this.logger.info(`loading world from snapshot '${state.created_at}'`);

                return World(state);
            })
            .then((world: IWorldObject) => this.liveLoad(world))
            .then((world: IWorldObject) => {
                this.redis.set('lucid.state', JSON.stringify(world));
                this.logger.info('world loading complete');
            });
    },
    methods: {
        newWorld(): IWorldObject {
            this.logger.warn('constructing new world');

            return World({
                uuid: uuid.v1(),
                created_at: new Date(),
                updated_at: new Date(),
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
