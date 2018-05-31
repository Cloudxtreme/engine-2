import * as Bluebird from "bluebird";
import * as lodash from "lodash";
import * as validate from "validate.js";
import * as uuid from "uuid";

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

/**
 * ObjectType is the base type from which all other objects are derived. World objects are never created from
 * ObjectType, but instead are created with the various extensions of this type. If a key is not passed, then
 * a key will be generated for the object, as well as a date for createdAt and updatedAt if they are not explicitly
 * passed.
 *
 * @param {object} traits the traits of the newly created object
 * @returns {object} the created object along with uuid.
 */
const ObjectType = traits => {
    // set the defaults
    if (!traits.uuid) traits.uuid = uuid.v1();
    if (!traits.createdAt) traits.createdAt = new Date();
    if (!traits.updatedAt) traits.updatedAt = traits.createdAt;

    // merge the schema with the ObjectSchema
    if (traits.schema) traits.schema = lodash.merge(ObjectSchema, traits.schema);

    // auto generate the key if not present
    if (!traits.key) {
        const prefix = lodash.kebabCase(traits.objectType.replace("ObjectType", ""));
        const suffix = traits.uuid.slice(-5);
        traits.key = `${prefix}:${suffix}`;
    }

    // add a default beforeValidate hook
    if (!traits.beforeValidate) traits.beforeValidate = p => Promise.resolve(p);

    return { schema: ObjectSchema, ...traits };
};

/**
 * combines the traits of the provided ObjectTypes with the given type.
 * @param types a list of types to combine
 * @returns {function} an object type combinator
 */
export const combine = (...types) => {
    const objectType = lodash.last(types).name;
    return (traits = {}) => {
        const beforeValidateHooks = [];

        const preparedTypes = types.map(type => {
            if (typeof type === "function") return trts => Bluebird.resolve(type(trts));
            return type;
        });

        return Bluebird.reduce(
            preparedTypes,
            (aggregateType, type) => {
                return type(aggregateType)
                    .then(t => {
                        if (t.beforeValidate) beforeValidateHooks.push(t.beforeValidate);
                        return t
                    })
            },
            { ...traits, objectType }
        )
            .then(newObject => ObjectType(newObject))
            .then(newObject => Bluebird.reduce(beforeValidateHooks, (r, hook) => hook(r), newObject));
    };
};
