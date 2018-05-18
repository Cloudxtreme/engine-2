"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../ObjectTypes/CharacterObjectType/index");
const index_2 = require("../../ObjectTypes/WorldObjectType/index");
const OBJECT_PROTOTYPES = {
    World: index_2.WorldObjectType,
    Character: index_1.CharacterObjectType,
};
exports.ObjectService = (config) => ({
    name: 'world.objects',
    metadata: config,
    actions: {
        create(ctx) {
            this.logger.debug(`creating '${ctx.params.object_type}' object`);
            return OBJECT_PROTOTYPES[ctx.params.object_type](ctx.params);
        },
    },
});
//# sourceMappingURL=ObjectService.js.map