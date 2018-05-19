"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = (objectType) => {
    let schema = {
        key: {
            presence: true,
            uniqueKey: 'An object with key \'%{value}\' already exists.',
        },
        object_type: {
            presence: true,
        },
    };
    return (config) => {
        const object = objectType(config);
        if (object.schema) {
            schema = Object.assign({}, schema, object.schema);
            delete object.schema;
        }
        return Object.assign({ schema }, objectType(config));
    };
};
//# sourceMappingURL=ObjectType.js.map