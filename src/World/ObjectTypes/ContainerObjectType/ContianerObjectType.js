const { createObjectType } = require('../ObjectType');

let  ContainerObjectType = (traits) => {
    const schema = {
        objects: {
            presence: true,
            validateObjectType: 'object',
        },
    };

    return {
        ...traits,
        schema,
        objects: {},
    };
};

ContainerObjectType = createObjectType(ContainerObjectType);

export { ContainerObjectType };
