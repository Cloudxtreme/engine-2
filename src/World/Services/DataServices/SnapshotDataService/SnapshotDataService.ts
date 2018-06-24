import * as Bluebird from "bluebird";

import {Service} from "../../../../Service";
import {DataService} from "../DataService";

export interface ISnapshot {
    id: number;
    created_at: Date;
    data: any;
}

export const SnapshotDataService = Service.define(
    "snapshots",
    DataService,
    Service.method(
        "findLatest",
        function(): Bluebird<ISnapshot> {
            return this.knex
                .select("*")
                .from("snapshots")
                .orderBy("created_at", "desc")
                .limit(1)
                .then((rows: ISnapshot[]) => {
                    return rows[0];
                });
        },
    ),
);
