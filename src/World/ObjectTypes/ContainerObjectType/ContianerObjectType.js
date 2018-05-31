import {combine} from "../ObjectType";


let  ContainerObjectType = (traits) => {
    const schema = {
        objects: {
            presence: true,
            objectType: 'object',
        },
    };

    return {
        objects: {},
        ...traits,
        schema,
    };
};

ContainerObjectType = combine(ContainerObjectType);

export { ContainerObjectType };
