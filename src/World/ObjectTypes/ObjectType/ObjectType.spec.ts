import * as lodash from 'lodash';

import {
    createObjectType,
    IObjectArgs,
    IObjectType,
    ObjectType,
} from './ObjectType';

const mockFunction1 = jest.fn();
const mockFunction2 = jest.fn();

interface ITestObjectArgs extends IObjectArgs {
    foo: string;
}

const TestObjectType = (props: ITestObjectArgs): IObjectType => (<IObjectType>{
    schema: {
        foo: {
            presence: true,
        },
        object: {
            objectType: 'array',
        },
    },
    ...props,
    beforeValidate: (p: IObjectType) => new Promise((resolve: Function) => {
        mockFunction1(p);

        return resolve(p);
    }),
});

const AnotherTestObject = (props: ITestObjectArgs): IObjectType => (<IObjectType>{
    schema: {
        object: {
            objectType: 'object',
        },
    },
    ...props,
    beforeValidate: (p: IObjectType) => new Promise((resolve: Function) => {
        mockFunction2(p);

        return resolve(p);
    }),
});

describe('createObjectType', () => {
    let instance;
    beforeEach(() => {
        instance = createObjectType(TestObjectType)(<IObjectArgs>{foo: 'bar'});
    });

    it('builds an object with the correct objectType', () => {
        return instance
            .then((props: IObjectType) => expect(props.objectType).toEqual('TestObjectType'));
    });

    it('calls beforeCreate on the objectType', () => {
        return instance
            .then((props: IObjectType) => (expect(mockFunction1).toHaveBeenCalledWith(props)));
    });

    describe('multi extend', () => {
        beforeEach(() => {
            instance = createObjectType(AnotherTestObject, TestObjectType)(<IObjectArgs>{foo: 'bar'});
        });

        it('calls beforeCreate on all of the extended objectTypes in order', () => {
            return instance
                .then((props: IObjectType) => {
                    expect(mockFunction1).toHaveBeenCalledWith(props);
                    expect(mockFunction2).toHaveBeenCalledWith(props);
                });
        });

        it('sets the objectType to the first object type', () => {
            return instance
                .then((props: IObjectType) => {
                    expect(props.objectType).toEqual('TestObjectType');
                });
        });
    });

    describe('validation', () => {
        let builder;
        beforeEach(() => {
            builder = createObjectType(AnotherTestObject, TestObjectType);
        });

        it('should allow validated fields', () => {
            return expect(builder({foo: 'bar'})).resolves.toBeDefined();
        });
    });
});

describe('ObjectType', () => {
    let instance;
    beforeEach(() => {
        instance = createObjectType(TestObjectType)(<IObjectArgs>{foo: 'bar'});
    });

    it('defines the uuid', () => {
        return instance
            .then((props: IObjectType) => expect(props.uuid).toBeDefined());
    });

    it('sets createdAt', () => {
        return instance
            .then((props: IObjectType) => expect(props.createdAt).toBeDefined());
    });

    it('sets updatedAt', () => {
        return instance
            .then((props: IObjectType) => expect(props.updatedAt).toBeDefined());
    });
});

describe('validateObjectType', () => {
    let instance;

    describe('an array of objects', () => {
        beforeEach(() => {
            instance = createObjectType(TestObjectType);
        });

        it('allows null values', () => {
            expect(instance({foo: 'bar'})).resolves.toBeDefined();
        });

        it('validates each item in the array', () => {
            expect(instance({
                foo: 'bar', object: [
                    instance({foo: 'bar'}),
                    instance({foo: 'bar'}),
                ],
            })).resolves.toBeDefined();
        });

        it('does not validate if the instance int he array is invalid', () => {
            expect(instance({
                foo: 'bar', object: [
                    instance(),
                    instance({foo: 'bar'}),
                ],
            })).resolves.toBeFalsy();
        });
    });

    describe('object of objects', () => {
        beforeEach(() => {
            instance = createObjectType(AnotherTestObject);
        });

        it('validates each item in the object', () => {
            expect(instance({
                foo: 'bar',
                object: {
                    foo: instance({foo: 'bar'}),
                    bar: instance({foo: 'bar'}),
                },
            })).resolves.toBeTruthy();
        });

        it('does not validate if one of the objects is invalid', () => {
            expect(instance({
                foo: 'bar',
                object: {
                    foo: instance(),
                    bar: instance({foo: 'bar'}),
                },
            })).resolves.toBeFalsy();
        });
    });
});
