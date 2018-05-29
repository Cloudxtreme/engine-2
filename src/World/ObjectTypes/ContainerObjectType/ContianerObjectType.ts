import {
    createObjectType,
    IObjectArgs,
    IObjectSet,
    IObjectType,
} from '../ObjectType';

interface IContainerObjectType extends IObjectType {
    objects: IObjectSet | {};
}

export const ContainerObjectType = createObjectType((props: IObjectArgs) => {
    const schema = {
        objects: {
            presence: true,
            validObjectType: 'object',
        },
    };

    return {
        objects: {},
        ...<IObjectType>props,
        schema,
    };
});
