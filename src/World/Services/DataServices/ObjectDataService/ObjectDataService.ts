import * as Bluebird from 'bluebird';
import {Context} from 'moleculer';

import {IObject} from '../../../ObjectTypes/ObjectType/index';
import {WorldObjectType} from '../../../ObjectTypes/WorldObjectType';
import {DataService} from '../DataService';

interface ICount {
    count: string;
}

export const ObjectDataService = DataService(() => ({
    name: 'object',
    // tslint:disable-next-line
    create({key, object_type, player_id, ...data}: any) {
        return this.db.returning('uuid')
            .insert({
                key,
                object_type,
                data,
                player_id,
            })
            .into('objects')
            .then((uuid: [string]) => {
                return WorldObjectType({
                    uuid,
                    key,
                    object_type,
                    ...data,
                });
            });
    },
    actions: {
        findForPlayer(ctx: Context) {
            return this.db.select()
                .where({player_id: ctx.params.player_id, object_type: ctx.params.object_type})
                .from('objects')
                // tslint:disable-next-line
                .then((data: [any]) => {
                    return data;
                });
        },
        keyExists(ctx: Context): Bluebird<boolean> {
            return this.db.count('*')
                .where({key: ctx.params})
                .from('objects')
                .then((result: [ICount]) => {
                    return parseInt(result[0].count, 10) > 0;
                });
        },
        updateForKey(ctx: Context): Bluebird<boolean> {
            return this.db.returning('uuid')
                .update(ctx.params.props)
                .from('objects')
                .where({key: ctx.params.key})
                .then((object: IObject) => {
                    return {uuid: object[0], ...ctx.params.props};
                });
        },
    },
}));
