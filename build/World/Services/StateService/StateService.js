"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../../Service");
exports.StateService = Service_1.Service.define("state", Service_1.Service.onCreate(function () {
    this.logger.info("starting state service");
}));
