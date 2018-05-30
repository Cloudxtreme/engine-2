import {createObjectType} from "../ObjectType";
import {ContainerObjectType} from "./ContianerObjectType";

describe('ContainerObjectType', () => {
    let instance;
    beforeEach(() => {
        instance = createObjectType(ContainerObjectType);
    });

    it('requires objects to be present', () => {
        return expect(instance({objects: null})).rejects.toBeFalsy()
    })
});
