const { createObjectType } = require('../ObjectType');

let  ContainerObjectType = (props) => {
    const schema = {
        objects: {
            presence: true,
            validateObjectType: 'object',
        },
    };

    return {
        ...props,
        schema,
        objects: {},
    };
};

ContainerObjectType = createObjectType(ContainerObjectType);

export { ContainerObjectType };
