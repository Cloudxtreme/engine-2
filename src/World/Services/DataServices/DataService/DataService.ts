import * as Knex from "knex";
import { define, onCreate, onStop } from "../../../../Service";

export const DataService = define(
    "data",
    onCreate(function() {
        this.logger.debug("connecting to database");
        this.knex = Knex(
            // tslint:disable-next-line:non-literal-require
            require(`${process.env.GAME_ROOT}/config/knexfile.js`),
        );
    }),
    onStop(function() {
        return this.knex.destroy();
    }),
);
