import * as bcrypt from 'bcrypt';


import {IWorldConfig} from '../../World';

interface IPlayer {
    username?: string;
    password?: string;
}

export const Player = (config: IWorldConfig) => ({
    settings: config,
    name: 'player',
    create(object: IPlayer): boolean {
        this.db.insert({
            username: object.username,
            password: this.hashPassword(object.password),
        })
            .into('players');

        return true;
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
