"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const lodash = require("lodash");
const uuid = require("uuid");
const uniquenessValidator = (key) => {
    return new Promise((resolve) => {
        return this.broker.call('world.index.exists', key)
            .then((exists) => {
            if (exists)
                return resolve(false);
            return resolve(true);
        });
    });
};
exports.ObjectType = (props) => {
    const schema = {
        uuid: {
            presence: true,
        },
        key: {
            presence: true,
            unique: {
                validator: uniquenessValidator.bind(this),
                errorMessage: 'An object with key \'%{value}\' already exists.',
            },
        },
        objectType: {
            presence: true,
        },
    };
    if (!props.uuid)
        props.uuid = uuid.v1();
    if (!props.createdAt)
        props.createdAt = new Date();
    if (!props.updatedAt)
        props.updatedAt = props.createdAt;
    if (props.schema)
        props.schema = lodash.merge(schema, props.schema);
    if (!props.key) {
        const prefix = props.objectType.replace('ObjectType', '').toLowerCase();
        const suffix = lodash.last(props.uuid.split('-'));
        props.key = `${prefix}-${suffix}`;
    }
    if (!props.beforeCreate)
        props.beforeCreate = (p) => Promise.resolve(p);
    return Object.assign({ schema }, props);
};
exports.extend = (...types) => {
    return (props) => {
        const objectType = types[0].name;
        const object = exports.ObjectType(types[0](Object.assign({}, props, { objectType })));
        return Bluebird.reduce([
            object.beforeCreate(object),
        ], (p) => (Promise.resolve(p)));
    };
};
//# sourceMappingURL=ObjectType.js.map