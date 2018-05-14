import {Context} from 'moleculer';

import {IWorldConfig} from '../../World';
import {Character} from '../Character';
import {World} from '../World';

const OBJECT_PROTOTYPES = {
    World,
    Character,
};

export const ObjectService = (config: IWorldConfig) => ({
    name: 'world.objects',
    metadata: config,
    actions: {
        create(ctx: Context) {
            this.logger.debug(`creating '${ctx.params.object_type}' object`);

            return OBJECT_PROTOTYPES[ctx.params.object_type](ctx.params);
        },
    },
});
