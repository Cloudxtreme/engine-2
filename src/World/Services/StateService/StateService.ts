import { Service } from "../../../Service";

export const StateService = Service.define(
    "state",
    Service.onCreate(function() {
        this.logger.info("starting state service");
    }),
);
