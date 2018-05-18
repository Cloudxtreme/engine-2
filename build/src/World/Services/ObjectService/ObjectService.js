"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectTypes_1 = require("../../ObjectTypes");
const OBJECT_PROTOTYPES = {
    World: ObjectTypes_1.WorldObjectType,
    Character: ObjectTypes_1.CharacterObjectType,
};
exports.ObjectService = (config) => ({
    name: 'world.objects',
    metadata: config,
    actions: {
        build(ctx) {
            return this.create(ctx.params);
        },
        buildAndCreate(ctx) {
            return this.build(ctx.params)
                .then((object) => (this.create(object)));
        },
    },
    methods: {
        build(props) {
            this.logger.debug(`building '${props.object_type}' object`);
            return Promise.resolve(OBJECT_PROTOTYPES[props.object_type](props));
        },
        create(object) {
            this.logger.debug(`saving '${object.object_type}:${object.key}'`);
            return this.broker.call('data.object.create', object);
        },
    },
});
//# sourceMappingURL=ObjectService.js.map