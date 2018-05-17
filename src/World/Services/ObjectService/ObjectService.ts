import {Context} from 'moleculer';

import {CharacterObjectType} from '../../ObjectTypes/CharacterObjectType/index';
import {WorldObjectType} from '../../ObjectTypes/WorldObjectType/index';
import {IWorldConfig} from '../../World';

const OBJECT_PROTOTYPES = {
    World: WorldObjectType,
    Character: CharacterObjectType,
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
