import {DataService} from '../DataService';

export const Object = DataService(() => ({
    name: 'object',
    // tslint:disable-next-line
    create(object: any) {
        return this.db.insert(object)
            .into('objects');
    },
}));
