"use strict";
const Bluebird = require("bluebird");
const lodash = require("lodash");
const uuid = require("uuid");
const validate = require("validate.js");


const ObjectSchema = {
    uuid: {
        presence: true,
    },
    key: {
        presence: true,
    },
    objectType: {
        presence: true,
    },
};

const validateObject = (object, schema) => {
    return new Promise((resolve, reject) => {
        return validate.async(object, schema, { cleanAttributes: false })
            .then(resolve, reject);
    });
};

validate.validators.objectType = (value, options) => {
    return new Promise((resolve, reject) => {
        if (!value) return resolve();

        if (options === true) {
            const t = value;
            return validateObject(t, t.schema)
                .then(() => resolve())
                .catch((e) => resolve(e));
        } else if (options === 'array') {
            const t = value;
            return Bluebird.all(t.map((v) => (validateObject(v, v.schema))))
                .then(() => resolve())
                .catch((e) => resolve(e));
        } else if (options === 'object') {
            const t = value;
            return Bluebird.all(lodash.values(t).map((v) => (validateObject(v, v.schema))))
                .then(() => resolve())
                .catch((e) => resolve(e));
        } else {
            return reject('invalid option');
        }
    });
};

exports.ObjectType = (props) => {
    if (!props.uuid)
        props.uuid = uuid.v1();
    if (!props.createdAt) props.createdAt = new Date();
    if (!props.updatedAt) props.updatedAt = props.createdAt;
    if (props.schema) props.schema = lodash.merge(ObjectSchema, props.schema);

    if (!props.key) {
        const prefix = lodash.kebabCase(props.objectType.replace('ObjectType', ''));
        const suffix = props.uuid.slice(-5);
        props.key = `${prefix}:${suffix}`;
    }
    if (!props.beforeValidate)
        props.beforeValidate = (p) => Promise.resolve(p);
    return Object.assign({ schema: ObjectSchema }, props);
};

exports.createObjectType = (...types) => {
    return (props) => {
        const objectType = lodash.last(types).name;
        const beforeValidateHooks = [];
        const preparedTypes = types.map((t) => {
            if (typeof t === 'function') {
                return (p) => (Bluebird.resolve(t(p)));
            }
            return t;
        });
        return Bluebird.reduce(preparedTypes, (p, t) => {
            if (p.beforeValidate)
                beforeValidateHooks.push(p.beforeValidate);
            return t(p);
        }, Object.assign({ objectType }, props))
            .then((p) => exports.ObjectType(p))
            .then((p) => (Bluebird.reduce(beforeValidateHooks, (object, hook) => (hook.bind(object)()), p)));
    };
};
