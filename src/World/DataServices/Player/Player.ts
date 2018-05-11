import * as bcrypt from 'bcrypt';

import * as Bluebird from 'bluebird';
import {Context} from 'moleculer';

import {IWorldConfig} from '../../World';
import {DataService} from '../DataService';

export interface IPlayer {
    id?: number;
    uuid?: string;
    username?: string;
    password?: string;
}

export const Player = DataService((config: IWorldConfig) => ({
    settings: config,
    name: 'player',
    //tslint:disable-next-line
    create(object: IPlayer): Bluebird<any> {
        return new Promise((resolve: Function) => {
            this.hashPassword(object.password)
                .then((password: string) => {
                    return this.db.insert({
                        username: object.username,
                        password,
                    })
                        .into('players');
                })
                .then((data: IPlayer) => {
                    resolve(data);
                });
        });
    },
    methods: {
        validatePassword(password: string, hash: string) {
            return bcrypt.compare(password, hash);
        },
        hashPassword(password: string) {
            return bcrypt.hash(password, 10);
        },
        authenticate(username: string, password: string) {
            return this.db.select('password', 'id')
                .from('players')
                .where({username})
                //tslint:disable-next-line:no-any
                .then((data: any) => {
                    return this.validatePassword(password, data[0].password);
                })
                .then((e: boolean) => {
                    return e;
                });
        },
    },
    actions: {
        authenticate(ctx: Context) {
            return this.authenticate(ctx.params.username, ctx.params.password);
        },
    },
}));
