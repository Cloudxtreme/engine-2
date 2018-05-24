"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return Object.assign({ schema }, props);
};
exports.extend = (...types) => {
    if (types.length === 1) {
        return (props) => {
            const objectType = types[0].name;
            return exports.ObjectType(types[0](Object.assign({}, props, { objectType })));
        };
    }
    return (props) => {
        return exports.ObjectType(types.reverse().reduce((object, t) => {
            return lodash.merge(Object.assign({}), Object.assign({}, object, t(object)));
        }, props));
    };
};
//# sourceMappingURL=ObjectType.js.map