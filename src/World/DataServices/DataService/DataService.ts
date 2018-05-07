//tslint:disable-next-line
import knex from 'knex';
import {
    Context,
    ServiceMethods,
    ServiceSchema,
    ServiceSettingSchema,
} from 'moleculer';

interface IDataServiceSchema {
    name: string;
    create: Function;
    methods?: ServiceMethods;
    settings?: ServiceSettingSchema;
}

export const DataService = (schema: IDataServiceSchema): ServiceSchema => {
    return {
        name: `data.${schema.name}`,
        methods: schema.methods,
        settings: schema.settings,
        actions: {
            create(ctx: Context) {
                return schema.create.bind(this)(ctx.params);
            },
        },
        created() {
            // tslint:disable-next-line:non-literal-require
            this.db = knex(require(`${process.env.GAME_ROOT}/config/knexfile`));
        },
    };
};
