import * as bcrypt from 'bcrypt';

import * as Bluebird from 'bluebird';
import {IWorldConfig} from '../../World';

export interface IPlayer {
    id?: number;
    uuid?: string;
    username?: string;
    password?: string;
}

export const Player = (config: IWorldConfig) => ({
    settings: config,
    name: 'player',
    //tslint:disable-next-line
    create(object: IPlayer): Bluebird<any> {
        return new Promise((resolve: Function) => {
            return this.db.insert({
                username: object.username,
                password: this.hashPassword(object.password),
            })
                .into('players')
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
    },
});
