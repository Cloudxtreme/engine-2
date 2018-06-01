const Bluebird = require("bluebird");
const lodash = require("lodash");
const validate = require("validate.js");
const uuid = require("uuid");

const ObjectSchema = {
    uuid: {
        presence: true
    },
    key: {
        presence: true
    },
    objectType: {
        presence: true
    }
};

const validateObject = (object, schema) => {
    return new Promise((resolve, reject) => {
        return validate.async(object, schema, { cleanAttributes: false }).then(resolve, reject);
    });
};

validate.validators.objectType = (value, options) => {
    return new Promise((resolve, reject) => {
        if (!value) return resolve();

        if (options === true) {
            const t = value;
            return validateObject(t, t.schema)
                .then(() => resolve())
                .catch(e => resolve(e));
        } else if (options === "array") {
            const t = value;
            return Bluebird.all(t.map(v => validateObject(v, v.schema)))
                .then(() => resolve())
                .catch(e => resolve(e));
        } else if (options === "object") {
            const t = value;
            return Bluebird.all(lodash.values(t).map(v => validateObject(v, v.schema)))
                .then(() => resolve())
                .catch(e => resolve(e));
        } else {
            return reject("invalid option");
        }
    });
};

const ObjectType = traits => {
    // set the defaults
    if (!traits.uuid) traits.uuid = uuid.v1();
    if (!traits.createdAt) traits.createdAt = new Date();
    if (!traits.updatedAt) traits.updatedAt = traits.createdAt;

    // auto generate the key if not present
    if (!traits.key) {
        const prefix = lodash.kebabCase(traits.objectType.replace("ObjectType", ""));
        const suffix = traits.uuid.slice(-5);
        traits.key = `${prefix}:${suffix}`;
    }

    // add a default beforeValidate hook
    if (!traits.beforeValidate) traits.beforeValidate = p => Promise.resolve(p);

    return {
        schema: lodash.merge({}, traits.schema || {}, ObjectSchema),
        ...traits,
        inherits(nameOrType) {
            if (typeof nameOrType === "function") {
                nameOrType = nameOrType.name;
            }

            return lodash.indexOf(this.inherited, nameOrType) !== -1;
        }
    };
};

module.exports.combine = (...types) => {
    const objectType = lodash.last(types).name;
    return (traits = {}) => {
        const beforeValidateHooks = [];
        const afterValidateHooks = [];
        const inherited = [];

        const preparedTypes = types.map(type => {
            inherited.push(type.name);
            if (typeof type === "function") return trts => Bluebird.resolve(type(trts));
            return type;
        });

        return Bluebird.reduce(
            preparedTypes,
            (aggregateType, type) => {
                return type(aggregateType).then(t => {
                    if (t.beforeValidate) beforeValidateHooks.push(t.beforeValidate);
                    if (t.afterValidate) afterValidateHooks.push(t.afterValidate);
                    return { ...{}, ...t, objectType };
                });
            },
            { ...traits, objectType, inherited }
        )
            .then(newObject => ObjectType(newObject))
            .then(newObject => {
                lodash.keys(newObject).forEach(key => {
                    const value = newObject[key];
                    if (typeof value === "function") {
                        newObject[key] = value.bind(newObject);
                    }
                });

                return newObject;
            })
            .then(newObject =>
                Bluebird.reduce(beforeValidateHooks, (r, hook) => hook(r), newObject)
            )
            .then(newObject =>
                Bluebird.each(afterValidateHooks, hook => hook.bind(newObject)()).then(
                    () => newObject
                )
            )
            .then(newObject => {
                if (!newObject.schema) return;
                return validate.async(newObject, newObject.schema, { cleanAttributes: false });
            });
    };
};
