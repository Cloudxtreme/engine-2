import * as Bluebird from "bluebird";
import { Context } from "moleculer";

import { action, define, method } from "../../../../Service";
import { DataService } from "../DataService";

export interface ISnapshot {
    id: number;
    created_at: Date;
    data: any;
}

export const SnapshotDataService = define(
    "snapshots",
    DataService,
    method("findLatest", function(): Bluebird<ISnapshot> {
        this.logger.debug("finding latest snapshot");

        return this.knex
            .select("*")
            .from("snapshots")
            .orderBy("created_at", "desc")
            .limit(1)
            .then(
                (rows: ISnapshot[]): ISnapshot => {
                    return rows[0];
                },
            );
    }),
    method("create", function(snapshot: any): Bluebird<ISnapshot> {
        this.logger.debug("saving snapshot");

        return this.knex
            .returning("id")
            .insert({ data: snapshot })
            .into("snapshots")
            .then((rows: ISnapshot[]) =>
                this.knex
                    .select("*")
                    .from("snapshots")
                    .where({ id: rows[0] }),
            )
            .then((rows: ISnapshot[]): ISnapshot => rows[0]);
    }),
    action("findLatest", function(): Promise<ISnapshot> {
        return <Promise<ISnapshot>>this.findLatest();
    }),
    action("create", async function(ctx: Context): Promise<ISnapshot> {
        console.log(ctx.params);
        return <Promise<ISnapshot>>this.create(ctx.params);
    }),
);
