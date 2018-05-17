import * as Bluebird from 'bluebird';

import {IObject} from '../../../ObjectTypes/ObjectType/index';
import {WorldObjectType} from '../../../ObjectTypes/WorldObjectType/index';
import {DataService, IDataServiceSchema} from '../DataService/index';

export const SnapshotDataService = DataService((): IDataServiceSchema => ({
    name: 'snapshot',
    create(data: IObject) {
        return this.db.insert({
            data: data,
        })
            .into('snapshots')
            .then(() => {
                return WorldObjectType(data);
            });
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
