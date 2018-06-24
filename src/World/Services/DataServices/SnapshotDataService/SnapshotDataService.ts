import * as Bluebird from "bluebird";

import { Service } from "../../../../Service";
import { DataService } from "../DataService";

export interface ISnapshot {
    id: number;
    created_at: Date;
    data: any;
}

export const SnapshotDataService = Service.define(
    "snapshots",
    DataService,
    Service.method("findLatest", function(): Bluebird<ISnapshot> {
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
    Service.method("create", function(snapshot: any): Bluebird<ISnapshot> {
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
);
