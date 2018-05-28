import {ServiceSchema} from 'moleculer';
import * as validate from 'validate.js';

import {IObjectType, WorldObjectType} from '../../../ObjectTypes';

export const WorldService: ServiceSchema = {
    name: 'world.state.world',
    created() {
        this.logger.debug('loading initial world state');

        return this.broker.call('data.snapshot.getLatest')
        //tslint:disable-next-line
            .then((state: any) => {
                if (!state) {
                    this.logger.warn('no existing snapshot');

                    return this.newWorld()
                        .then((world: IObjectType) => {
                            this.logger.warn('creating initial snapshot');

                            return this.broker.call('data.snapshot.create', world);
                        });

                }
                this.logger.info(`loading world from snapshot '${state.created_at}'`);

                return WorldObjectType({...state, ...state.data});
            })
            .then((world: IObjectType) => this.liveLoad(world))
            .then((world: IObjectType) => {
                const worldAttributes = validate.cleanAttributes(world, world.schema);
                delete worldAttributes.updated_at;
                this.redis.set('lucid.state', JSON.stringify({world: worldAttributes}));
            });
    },
};
