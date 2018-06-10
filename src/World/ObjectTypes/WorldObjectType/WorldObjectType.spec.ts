import {ServiceBroker} from "moleculer";

import { WorldObjectType } from "./WorldObjectType";

global.broker = new ServiceBroker();
global.createService = jest.fn();

describe("WorldObjectType", () => {
    let instance;

    beforeEach(() => {
        instance = new WorldObjectType();
    });

    it("should have the key 'world'", () => {
        expect(instance.key).toEqual("world");
    });
});
