import * as Bluebird from 'bluebird';
import * as glob from 'glob-fs';
import {fromJS} from 'immutable';
import * as objectPath from 'object-path';

const g = glob();

import {
    Context,
    ServiceSchema,
} from 'moleculer';
import * as redis from 'redis';

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

import {
    IObject,
    WorldObjectType,
} from '../../ObjectTypes';
import {IWorldConfig} from '../../World';
import {RoomService} from './RoomService';
import {WorldService} from './WorldService';

export const StateService = (config: IWorldConfig): ServiceSchema => ({
    name: 'world.state',
    metadata: {...config},
    dependencies: ['data.snapshot'],
    mixins: [WorldService, RoomService],
    created() {
        this.logger.debug('creating redis connection');
        this.redis = redis.createClient(config.redis);
    },
    actions: {
        placeObjectIn(ctx: Context): Bluebird<void> {
            return this.broker.call('world.state.getIn', {path: `${ctx.params.path}.objects`})
                .then((state: any) => {
                    state[ctx.params.object.key] = ctx.params.object.data;

                    return state;
                })
                .then((object: any) => {
                    return this.broker.call('world.state.setIn', {path: `${ctx.params.path}.objects`, object});
                })
                .then(() => {
                    this.logger.info(`indexing location of '${ctx.params.object.key}:${ctx.params.object.object_type}'`);

                    return this.redis.hsetAsync(
                        'lucid.objectLocations',
                        ctx.params.object.key,
                        ctx.params.object.data.location,
                    );
                })
                .then(() => {
                    if (ctx.params.object.live) {
                        this.liveLoad(ctx.params.object);
                    }
                });
        },
        getIn(ctx: Context): Bluebird<void> {
            this.logger.debug(`loading '${ctx.params.path}' from state`);

            return this.redis.getAsync('lucid.state')
                .then((state: string) => (
                    objectPath.get(JSON.parse(state), ctx.params.path)
                ));
        },
        setIn(ctx: Context): Bluebird<void> {
            return this.broker.call('world.state.getIn', {path: 'world'})
                .then((state: IWorldConfig) => {
                    objectPath.set(state, ctx.params.path.replace('world.', ''), ctx.params.object);
                    this.redis.set(
                        'lucid.state',
                        JSON.stringify({world: state}),
                    );
                });
        },
    },
    methods: {
        newWorld(): IObject {
            this.logger.warn('constructing new world');

            return this.broker.call('world.objects.buildAndCreate', WorldObjectType({}));
        },
        placeObject(object: IObject) {
            this.logger.info(`placing '${object.key}:${object.object_type}' into word @ '${object.data.location}'`);
            this.broker.call('world.state.placeObjectIn', {path: object.data.location, object});
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
