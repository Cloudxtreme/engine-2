import {World} from '../../Objects/World';
import {DataService} from '../DataService';

export const Object = DataService(() => ({
    name: 'object',
    // tslint:disable-next-line
    create({key, object_type, ...data}: any) {
        return this.db.returning('uuid')
            .insert({
                key,
                object_type,
                data,
            })
            .into('objects')
            .then((uuid: [string]) => {
                return World({
                    uuid,
                    key,
                    object_type,
                    ...data,
                });
            });
    },
}));
