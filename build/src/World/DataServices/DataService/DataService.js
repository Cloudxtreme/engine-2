"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
exports.DataService = (schema) => {
    return {
        name: `data.${schema.name}`,
        methods: schema.methods,
        settings: schema.settings,
        actions: {
            create(ctx) {
                return schema.create.bind(this)(ctx.params);
            },
        },
        created() {
            this.db = knex_1.default(require(`${process.env.GAME_ROOT}/config/knexfile`));
        },
    };
};
//# sourceMappingURL=DataService.js.map