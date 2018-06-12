//tslint:disable-next-line
import * as Knex from "knex";
import {
    Actions,
    Context,
    ServiceMethods,
    ServiceSettingSchema,
} from "moleculer";
import { IWorldConfig } from "../../../World";

export interface IDataServiceSchema {
    name: string;
    create: Function;
    methods?: ServiceMethods;
    settings?: ServiceSettingSchema;
    actions?: Actions;
}

export const DataService = (builder: Function): Function => {
    return (config: IWorldConfig) => {
        const schema = builder(config);

        return {
            name: `data.${schema.name}`,
            methods: schema.methods,
            settings: schema.settings,
            actions: {
                create(ctx: Context) {
                    return schema.create.bind(this)({ ...ctx.params });
                },
                ...schema.actions,
            },
            created() {
                this.db = Knex(
                    // tslint:disable-next-line:non-literal-require
                    require(`${process.env.GAME_ROOT}/config/knexfile`),
                );
            },
        };
    };
};
