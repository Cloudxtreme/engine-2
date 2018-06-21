import { StateService } from "./StateService";

describe("StateService", () => {
    it("sets the name", () => {
        expect(StateService()).toEqual(
            expect.objectContaining({ name: "services.state" }),
        );
    });
});
