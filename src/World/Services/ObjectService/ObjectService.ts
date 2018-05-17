import {Context} from 'moleculer';

import {Character} from '../../Objects/Character/index';
import {World} from '../../Objects/World/index';
import {IWorldConfig} from '../../World';

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
