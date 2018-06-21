"use strict";
exports.__esModule = true;
var Bluebird = require("bluebird");
var moleculer_1 = require("moleculer");
var R = require("ramda");
var Service_1 = require("./Service");
var broker = new moleculer_1.ServiceBroker();
describe("Service", function () {
    describe("onCreate", function () {
        it("sets the base function for created if not set", function () {
            var mockFunction = jest.fn();
            Service_1.Service.onCreate(mockFunction)({}).created(broker);
            expect(mockFunction).toHaveBeenCalled();
        });
        it("chains multiple on creates together", function () {
            var mock1 = jest.fn();
            var mock2 = jest.fn();
            R.pipe(Service_1.Service.onCreate(mock1), Service_1.Service.onCreate(mock2))({}).created("foo");
            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });
    describe("onStart", function () {
        it("sets the base function for started if not set", function () {
            var mockFunction = jest.fn(function () { return Bluebird.resolve(); });
            return Service_1.Service.onStart(mockFunction)({})
                .started()
                .then(function () {
                return expect(mockFunction).toHaveBeenCalled();
            });
        });
        it("chains multiple on creates together", function () {
            var mock1 = jest.fn(function () { return Bluebird.resolve(); });
            var mock2 = jest.fn(function () { return Bluebird.resolve(); });
            R.pipe(Service_1.Service.onStart(mock1), Service_1.Service.onStart(mock2))({})
                .started()
                .then(function () {
                expect(mock1).toHaveBeenCalledWith("foo");
                expect(mock2).toHaveBeenCalledWith("foo");
            });
        });
    });
    describe("onStop", function () {
        it("sets the base function for stopped if not set", function () {
            var mockFunction = jest.fn(function () { return Bluebird.resolve(); });
            Service_1.Service.onStop(mockFunction)({})
                .stopped()
                .then(function () {
                expect(mockFunction).toHaveBeenCalled();
            });
        });
        it("chains multiple on creates together", function () {
            var mock1 = jest.fn(function () { return Bluebird.resolve(); });
            var mock2 = jest.fn(function () { return Bluebird.resolve(); });
            R.pipe(Service_1.Service.onStop(mock1), Service_1.Service.onStop(mock2))({})
                .stopped()
                .then(function () {
                expect(mock1).toHaveBeenCalledWith("foo");
                expect(mock2).toHaveBeenCalledWith("foo");
            });
        });
    });
});
