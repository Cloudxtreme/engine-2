import {extend, IObject, IObjectArgs} from './ObjectType';

const TestObjectType = (props: IObjectArgs): IObject => (<IObject>{
    schema: {
        uuid: {
            unique: true,
        },
    },
    ...props,
});

describe('extend', () => {
    it('returns an object with the provided props', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).key).toEqual('name');
    });

    it('sets the uuid', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).uuid).toBeDefined();
    });

    it ('sets the createdAt date', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).createdAt).toBeDefined();
    });

    it ('sets the updatedAt date', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).updatedAt).toBeDefined();
    });

    it('sets the objectType', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).objectType).toEqual('TestObjectType');
    });

    it('correctly merges the props', () => {
        expect(extend(TestObjectType)({
            key: 'name',
        }).schema.uuid).toEqual({presence: true, unique: true});
        expect(extend(TestObjectType)({
            key: 'name',
        }).schema.objectType).toEqual({presence: true});
    });
});
