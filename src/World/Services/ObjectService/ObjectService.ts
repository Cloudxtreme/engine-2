import * as Bluebird from 'bluebird';
import {Context} from 'moleculer';
import * as path from 'path';
import * as validate from 'validate.js';
import {
    CharacterObjectType,
    IObjectType,
    WorldObjectType,
} from '../../ObjectTypes';
import {IWorldConfig} from '../../World';

interface ICreateObject extends IObjectType {
    playerUuid?: string;
}

interface IError {
    [index: string]: [string];
}

const OBJECT_PROTOTYPES = {
    World: WorldObjectType,
    Character: CharacterObjectType,
};

//tslint:disable-next-line:max-func-body-length
export const ObjectService = (config: IWorldConfig) => ({
    name: 'world.objects',
    metadata: config,
    actions: {
        /**
         * registers an object type
         */
        registerObjectType(ctx: Context): boolean {
            const t = path.basename(ctx.params.file).replace('.js', '');
            this.logger.info(`registering ObjectType '${t}' @ '${ctx.params.file}'`);
            //tslint:disable-next-line:non-literal-require
            OBJECT_PROTOTYPES[t] = require(ctx.params.file);

            return true;
        },
        /**
         * builds a transient game object.
         */
        build(ctx: Context): Bluebird<IObjectType> {
            return this.build(ctx.params);
        },
        /**
         * builds a transient game object, and immediately save that object to the object table.
         */
        buildAndCreate(ctx: Context): Bluebird<IObjectType> {
            return this.build(ctx.params)
                .then((object: IObjectType) => {
                    return this.create(object);
                });
        },
        /**
         * creates or updates an object in the object table.
         */
        createOrUpdate(ctx: Context): Bluebird<IObjectType> {
            this.logger.info(`creating or updating room '${ctx.params.key}' in object table`);
            this.logger.info(`checking if '${ctx.params.key}' exists in the object table`);

            return this.broker.call('data.object.keyExists', ctx.params.key)
                .then((exists: boolean) => {
                    if (exists) {
                        this.logger.debug(`object '${ctx.params.key}' exists, updating record`);

                        return this.update(ctx.params);
                    } else {
                        this.logger.debug(`object '${ctx.params.key}' does not exist, creating record`);

                        return this.broker.call('world.objects.buildAndCreate', ctx.params);
                    }
                });
        },
    },
    methods: {
        /**
         * Creates a transient object, transient objects are not persisted, and will not survive a state reset of
         * what ever parent object it is placed in.
         * @param {IObjectType} props the object props. Requires a key (which must be unique), and the object_type
         * @returns {IObjectType}
         */
        build(props: IObjectType): Bluebird<IObjectType> {
            this.logger.debug(`building '${props.object_type}' object`);

            return Promise.resolve(OBJECT_PROTOTYPES[props.object_type](props));
        },
        /**
         * Saves an object to the database. When objects are saved to the database, they will be restored to their
         * "home" position when the containing object is reloaded.
         * @param {IObjectType} object
         * @returns {Bluebird<IObjectType>}
         */
        create(object: ICreateObject): Bluebird<IObjectType> {
            this.logger.debug(`saving '${object.object_type}:${object.key}'`);

            const success = (attributes: IObjectType) => {
                return this.broker.call('data.object.create', attributes);
            };

            return this.validate(object, object.schema)
                .then(success, this.validationError);
        },
        /**
         * Updates an object in the database with the given attributes using the object key.
         * @param {IObjectType} props the attributes with which to update
         * @returns {Bluebird<IObjectType>}
         */
        update(props: IObjectType): Bluebird<IObjectType> {
            const success = (attributes: IObjectType) => {
                return this.broker.call('data.object.updateForKey', {key: props.key, props: attributes});
            };

            // we don't validate the key on update
            const schema = {...props.schema};
            delete schema.key;
            delete schema.uuid;

            return this.validate(props, schema)
                .then(success, this.validationError);

        },
        validationError(object: ICreateObject): Function {
            return (errors: Error | IError): boolean | Bluebird<IObjectType> => {
                if (errors instanceof Error) {
                    this.logger.error(errors);

                    return false;
                } else {
                    this.logger.warn(errors);

                    if (object.playerUuid) {
                        return this.broker.call(
                            `world.player.${object.playerUuid}.sendToScreen`,
                            `${errors.key[0].replace('Key ', '')}\n`,
                        );
                    }

                    return false;
                }
            };
        },
        // tslint:disable-next-line:no-any
        validate(props: IObjectType, schema: any) {
            return validate.async(props, schema);
        },
    },
    created() {
        validate.validators.uniqueKey = (value: string, errorString: string): Bluebird<string | void> => {
            return new Promise((resolve: Function) => {
                return this.broker.call('data.object.keyExists', value)
                    .then((exists: boolean) => {
                        if (!exists) {
                            resolve();
                        } else {
                            resolve(errorString);
                        }
                    });
            });
        };
    },
});
