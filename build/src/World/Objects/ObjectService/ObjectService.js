"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("../Character");
const World_1 = require("../World");
const OBJECT_PROTOTYPES = {
    World: World_1.World,
    Character: Character_1.Character,
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