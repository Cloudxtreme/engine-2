"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//tslint:disable-next-line
const Knex = require("knex");
exports.DataService = (builder) => {
    return (config) => {
        const schema = builder(config);
        return {
            name: `data.${schema.name}`,
            methods: schema.methods,
            settings: schema.settings,
            actions: Object.assign({ create(ctx) {
                    return schema.create.bind(this)(Object.assign({}, ctx.params));
                } }, schema.actions),
            created() {
                // tslint:disable-next-line:non-literal-require
                this.db = Knex(require(`${process.env.GAME_ROOT}/config/knexfile`));
            },
        };
    };
};
