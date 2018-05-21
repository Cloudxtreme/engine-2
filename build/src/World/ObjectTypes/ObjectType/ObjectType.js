"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = (props) => {
    const schema = Object.assign({}, props.schema, { key: {
            presence: true,
            uniqueKey: 'An object with key \'%{value}\' already exists.',
        }, object_type: {
            presence: true,
        } });
    return Object.assign({ schema }, props);
};
//# sourceMappingURL=ObjectType.js.map