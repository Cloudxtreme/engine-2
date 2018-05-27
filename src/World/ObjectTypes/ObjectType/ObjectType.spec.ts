import * as lodash from 'lodash';

import {createObjectType, IObject, IObjectArgs} from './ObjectType';

const mockFunction1 = jest.fn();
const mockFunction2 = jest.fn();

interface ITestObjectArgs extends IObjectArgs {
    foo: string;
}

const TestObjectType = (props: ITestObjectArgs): IObject => (<IObject>{
    schema: {
        foo: {
            presence: true,
        },
    },
    ...props,
    beforeValidate: (p: IObject) => new Promise((resolve: Function) => {
        mockFunction1(p);

        return resolve(p);
    }),
});

const AnotherTestObject = (props: ITestObjectArgs): IObject => (<IObject>{
    ...props,
    beforeValidate: (p: IObject) => new Promise((resolve: Function) => {
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
            .then((props: IObject) => expect(props.objectType).toEqual('TestObjectType'));
    });

    it('calls beforeCreate on the objectType', () => {
        return instance
            .then((props: IObject) => (expect(mockFunction1).toHaveBeenCalledWith(props)));
    });

    describe('multi extend', () => {
        beforeEach(() => {
            instance = createObjectType(AnotherTestObject, TestObjectType)(<IObjectArgs>{foo: 'bar'});
        });

        it('calls beforeCreate on all of the extended objectTypes in order', () => {
            return instance
                .then((props: IObject) => {
                    expect(mockFunction1).toHaveBeenCalledWith(props);
                    expect(mockFunction2).toHaveBeenCalledWith(props);
                });
        });

        it('sets the objectType to the first object type', () => {
            return instance
                .then((props: IObject) => {
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
