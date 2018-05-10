//tslint:disable-next-line
import Knex from 'knex';
import {
    Actions,
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
    actions?: Actions;
}

export const DataService = (schema: IDataServiceSchema): ServiceSchema => {
    return {
        name: `data.${schema.name}`,
        methods: schema.methods,
        settings: schema.settings,
        actions: {
            create(ctx: Context) {
                return schema.create.apply(this, ctx.params);
            },
            ...schema.actions,
        },
        created() {
            // tslint:disable-next-line:non-literal-require
            this.db = Knex(require(`${process.env.GAME_ROOT}/config/knexfile`));
        },
    };
};
