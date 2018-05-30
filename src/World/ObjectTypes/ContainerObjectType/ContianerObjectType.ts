import {
    createObjectType,
    IObjectArgs,
    IObjectType,
} from '../ObjectType/index';

let ContainerObjectType = (props: IObjectArgs): IObjectType => {
    const schema = {
        objects: {
            presence: true,
            validateObjectType: 'object',
        },
    };

    return {
        ...<IObjectType>props,
        schema,
        objects: {},
    };
};

ContainerObjectType = createObjectType(ContainerObjectType);

export {ContainerObjectType};
