"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const DataService_1 = require("../DataService");
exports.Player = DataService_1.DataService((config) => ({
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
            return this.db.select('password', 'id')
                .from('players')
                .where({ username })
                .then((data) => {
                return this.validatePassword(password, data[0].password);
            })
                .then((e) => {
                return e;
            });
        },
    },
    actions: {
        authenticate(ctx) {
            return this.authenticate(ctx.params.username, ctx.params.password);
        },
    },
}));
//# sourceMappingURL=Player.js.map