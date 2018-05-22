import {compose} from '../../../utils';
import {
    IObject,
    ObjectType,
} from '../ObjectType';

let WorldObjectType = (data: IObject) => {
    let schema = {
        updated_at: {},
        objects: {
            presence: true,
        },
    };

    schema = {...{}, ...data.schema, ...schema};

    delete data.schema;

    return {
        ...data,
        schema,
        object_type: 'World',
        key: 'world',
        updated_at: new Date(),
        live: true,
        destroyable: false,
        objects: {},
    };
};

WorldObjectType = compose(ObjectType, WorldObjectType);

export {WorldObjectType};
