"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const DataService_1 = require("../DataService");
exports.PlayerDataService = DataService_1.DataService((config) => ({
    settings: config,
    name: 'player',
    //tslint:disable-next-line
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
        /**
         * Validates the plaint text password string against a hashed password
         * @param {string} password the plain text password
         * @param {string} hash the hashed password
         * @returns {Promise<boolean>} true if the two match, false if they do not
         */
        validatePassword(password, hash) {
            return bcrypt.compare(password, hash);
        },
        hashPassword(password) {
            return bcrypt.hash(password, 10);
        },
        /**
         * authenticates the given plain text username and password. If valid, will return a user id, if invalid, will
         * return false
         * @param {string} username the username
         * @param {string} password the plain text password
         * @returns {Promise<boolean | number>} the id of the user or false if validation failed
         */
        authenticate(username, password) {
            let user;
            return this.db.select('password', 'id')
                .from('players')
                .where({ username })
                //tslint:disable-next-line:no-any
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
