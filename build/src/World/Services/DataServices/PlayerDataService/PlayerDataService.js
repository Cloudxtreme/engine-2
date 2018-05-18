"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const DataService_1 = require("../DataService");
exports.PlayerDataService = DataService_1.DataService((config) => ({
    settings: config,
    name: 'player',
    create(object) {
        return new Promise((resolve) => {
            this.hashPassword(object.password)
                .then((password) => {
                return this.db.insert({
                    username: object.username,
                    password,
                })
                    .into('players');
            })
                .then((data) => {
                resolve(data);
            });
        });
    },
    methods: {
        validatePassword(password, hash) {
            return bcrypt.compare(password, hash);
        },
        hashPassword(password) {
            return bcrypt.hash(password, 10);
        },
        authenticate(username, password) {
            let user;
            return this.db.select('password', 'id')
                .from('players')
                .where({ username })
                .then((data) => {
                return data[0];
            })
                .then((u) => {
                user = u;
                if (!user) {
                    return false;
                }
                return this.validatePassword(password, user.password);
            })
                .then((result) => {
                if (result) {
                    return user.id;
                }
                else {
                    return false;
                }
            })
                .then((e) => {
                return e;
            });
        },
    },
    actions: {
        authenticate(ctx) {
            this.logger.debug(`authenticating user '${ctx.params.username}'`);
            return this.authenticate(ctx.params.username, ctx.params.password);
        },
    },
}));
//# sourceMappingURL=PlayerDataService.js.map