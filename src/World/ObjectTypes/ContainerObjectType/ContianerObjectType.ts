import {
    IObjectArgs,
    IObjectSet,
    IObjectType,
} from '../ObjectType';

interface IContainerObjectType extends IObjectType {
    objects: IObjectSet | {};
}

const ContainerObjectType = (props: IObjectArgs): IContainerObjectType => {
    const schema = {
        objects: {
            presence: true,
            validObjectType: 'object',
        },
    };

    return {
        ...<IObjectType>props,
        schema,
        objects: {},
    };
};
