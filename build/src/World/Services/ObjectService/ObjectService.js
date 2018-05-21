"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
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
        registerObjectType(ctx) {
            const t = path.basename(ctx.params.file).replace('.js', '');
            this.logger.info(`registering ObjectType '${t}' @ '${ctx.params.file}'`);
            OBJECT_PROTOTYPES[t] = require(ctx.params.file);
            return true;
        },
        build(ctx) {
            return this.build(ctx.params);
        },
        buildAndCreate(ctx) {
            return this.build(ctx.params)
                .then((object) => {
                return this.create(object);
            });
        },
        createOrUpdate(ctx) {
            this.logger.info(`creating or updating room '${ctx.params.key}' in object table`);
            this.logger.info(`checking if '${ctx.params.key}' exists in the object table`);
            return this.broker.call('data.object.keyExists', ctx.params.key)
                .then((exists) => {
                if (exists) {
                    this.logger.debug(`object '${ctx.params.key}' exists, updating record`);
                    return this.update(ctx.params);
                }
                else {
                    this.logger.debug(`object '${ctx.params.key}' does not exist, creating record`);
                    return this.broker.call('world.objects.buildAndCreate', ctx.params);
                }
            });
        },
    },
    methods: {
        build(props) {
            this.logger.debug(`building '${props.object_type}' object`);
            return Promise.resolve(OBJECT_PROTOTYPES[props.object_type](props));
        },
        create(object) {
            this.logger.debug(`saving '${object.object_type}:${object.key}'`);
            const success = (attributes) => {
                return this.broker.call('data.object.create', attributes);
            };
            return this.validate(object, object.schema)
                .then(success, this.validationError);
        },
        update(props) {
            const success = (attributes) => {
                return this.broker.call('data.object.updateForKey', { key: props.key, props: attributes });
            };
            const schema = Object.assign({}, props.schema);
            delete schema.key;
            return this.validate(props, schema)
                .then(success, this.validationError);
        },
        validationError(object) {
            return (errors) => {
                if (errors instanceof Error) {
                    this.logger.error(errors);
                    return false;
                }
                else {
                    this.logger.warn(errors);
                    if (object.playerUuid) {
                        return this.broker.call(`world.player.${object.playerUuid}.sendToScreen`, `${errors.key[0].replace('Key ', '')}\n`);
                    }
                    return false;
                }
            };
        },
        validate(props, schema) {
            return validate.async(props, schema);
        },
    },
    created() {
        validate.validators.uniqueKey = (value, errorString) => {
            return new Promise((resolve) => {
                return this.broker.call('data.object.keyExists', value)
                    .then((exists) => {
                    if (!exists) {
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