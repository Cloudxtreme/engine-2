const R = require("ramda");

const Service = require("./Service");

describe("Service", () => {
    describe("setName", () => {
        it("sets the name", () => {
            expect(Service.setName("test")({}).name).toEqual("test");
        });
    });

    describe("onCreate", () => {
        it("sets the base function for created if not set", () => {
            const mockFunction = jest.fn();
            Service.onCreate(mockFunction)({}).created();
            expect(mockFunction).toHaveBeenCalled();
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            R.pipe(
                Service.onCreate(mock1),
                Service.onCreate(mock2)
            )({}).created("foo");

            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });
    
    describe("onStart", () => {
        it("sets the base function for started if not set", () => {
            const mockFunction = jest.fn();
            Service.onStart(mockFunction)({}).started();
            expect(mockFunction).toHaveBeenCalled();
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            R.pipe(
                Service.onStart(mock1),
                Service.onStart(mock2)
            )({}).started("foo");

            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });
    
    describe("onStop", () => {
        it("sets the base function for stopped if not set", () => {
            const mockFunction = jest.fn();
            Service.onStop(mockFunction)({}).stopped();
            expect(mockFunction).toHaveBeenCalled();
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            R.pipe(
                Service.onStop(mock1),
                Service.onStop(mock2)
            )({}).stopped("foo");

            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });
});
