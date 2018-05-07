"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
exports.Player = (config) => ({
    settings: config,
    name: 'player',
    create(object) {
        return new Promise((resolve) => {
            return this.db.insert({
                username: object.username,
                password: this.hashPassword(object.password),
            })
                .into('players')
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
    },
});
//# sourceMappingURL=Player.js.map