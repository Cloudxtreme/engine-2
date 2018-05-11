import * as Bluebird from 'bluebird';

import {IWorldObject} from '../../Objects/World';
import {DataService, IDataServiceSchema} from '../DataService';

export const Snapshot = DataService((): IDataServiceSchema => ({
    name: 'snapshot',
    create(data: IWorldObject) {
        return this.db.insert({
            data: data,
        })
            .into('snapshots');
    },
    actions: {
        getLatest() {
            return this.db.select()
                .from('snapshots')
                .orderBy('created_at', 'desc')
                .first()
                //tslint:disable-next-line:no-any
                .then((data: any) => {
                    if (!data) {
                        return false;
                    }

                    return data;
                });
        },
    },
}));
