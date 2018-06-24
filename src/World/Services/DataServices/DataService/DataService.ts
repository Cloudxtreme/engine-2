import * as Knex from "knex";
import {Service} from "../../../../Service";

export const DataService = Service.define(
    "data",
    Service.onCreate(function() {
        this.logger.debug("connecting to database");
        this.knex = Knex(
            // tslint:disable-next-line:non-literal-require
            require(`${process.env.GAME_ROOT}/config/knexfile.js`),
        );
    }),
    Service.onStop(function() {
        return this.knex.destroy();
    }),
);
