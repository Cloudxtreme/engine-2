import * as bcrypt from 'bcrypt';

import * as Bluebird from 'bluebird';
import {Context} from 'moleculer';

import {IWorldConfig} from '../../../World';
import {DataService} from '../DataService';

export interface IPlayer {
    id?: number;
    uuid?: string;
    username?: string;
    password?: string;
}

export const PlayerDataService = DataService((config: IWorldConfig) => ({
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
        /**
         * Validates the plaint text password string against a hashed password
         * @param {string} password the plain text password
         * @param {string} hash the hashed password
         * @returns {Promise<boolean>} true if the two match, false if they do not
         */
        validatePassword(password: string, hash: string) {
            return bcrypt.compare(password, hash);
        },
        hashPassword(password: string) {
            return bcrypt.hash(password, 10);
        },
        /**
         * authenticates the given plain text username and password. If valid, will return a user id, if invalid, will
         * return false
         * @param {string} username the username
         * @param {string} password the plain text password
         * @returns {Promise<boolean | number>} the id of the user or false if validation failed
         */
        authenticate(username: string, password: string): Promise<boolean | number> {
            let user;

            return this.db.select('password', 'id')
                .from('players')
                .where({username})
                //tslint:disable-next-line:no-any
                .then((data: any): IPlayer => {
                    return data[0];
                })
                .then((u: IPlayer): boolean | number => {
                    user = u;
                    if (!user) {
                        return false;
                    }

                    return this.validatePassword(password, user.password);
                })
                .then((result: boolean): boolean | number => {
                    if (result) {
                        return user.id;
                    } else {
                        return false;
                    }
                })
                .then((e: boolean | number) => {
                    return e;
                });
        },
    },
    actions: {
        authenticate(ctx: Context) {
            this.logger.debug(`authenticating user '${ctx.params.username}'`);

            return this.authenticate(ctx.params.username, ctx.params.password);
        },
    },
}));
