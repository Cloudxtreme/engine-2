"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = (props) => {
    let schema = Object.assign({}, props.schema, { key: {
            presence: true,
            uniqueKey: 'An object with key \'%{value}\' already exists.',
        }, object_type: {
            presence: true,
        }, uuid: {} });
    schema = Object.assign({}, props.schema, schema);
    return Object.assign({ schema }, props);
};
//# sourceMappingURL=ObjectType.js.map