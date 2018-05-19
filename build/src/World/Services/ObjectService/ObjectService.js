"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = require("validate.js");
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
            const success = (attributes) => (attributes);
            const error = (errors) => {
                if (errors instanceof Error) {
                    this.logger.error(errors);
                    return false;
                }
                else {
                    this.logger.warn(errors);
                    if (object.playerUuid) {
                        return this.broker.call(`world.player.${object.playerUuid}.sendToScreen`, `${errors.key[0].replace('Key', '')}\n`);
                    }
                    return false;
                }
            };
            return validate.async(object, object.schema)
                .then(success, error);
        },
    },
    created() {
        validate.validators.uniqueKey = (value, errorString) => {
            return new Promise((resolve) => {
                return this.broker.call('data.object.keyExists', value)
                    .then((exists) => {
                    if (exists) {
                        resolve();
                    }
                    else {
                        resolve(errorString);
                    }
                });
            });
        };
    },
});
//# sourceMappingURL=ObjectService.js.map