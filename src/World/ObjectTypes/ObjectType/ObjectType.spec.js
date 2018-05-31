const Bluebird = require('bluebird');
const lodash = require('lodash');

import {combine} from "./ObjectType";


const mockFunction1 = jest.fn();
const mockFunction2 = jest.fn();

describe('combine', () => {
    const BasicTestObjectType = (props) => ({
        ...props,
        foo: 'bar',
    });

    let instance;
    beforeEach(() => {
        instance = combine(BasicTestObjectType)();
    });

    it('builds an object with the correct objectType', () => {
        return instance
            .then((props) => expect(props.objectType).toEqual('BasicTestObjectType'));
    });

    it('sets a uuid', () => {
        return instance
            .then((props) => expect(props.uuid).toBeDefined());
    });

    it('sets a key', () => {
        return instance
            .then((props) => expect(props.key).toEqual(`basic-test:${props.uuid.slice(-5)}`));
    });

    it('sets createdAt', () => {
        return instance
            .then((props) => expect(props.createdAt).toBeDefined());
    });

    it('sets updatedAt', () => {
        return instance
            .then((props) => expect(props.updatedAt).toBeDefined());
    });

    describe('beforeValidate', () => {
        const CallbackTestObjectType = (props) => ({
            ...props,
            beforeValidate() {
                return Bluebird.resolve(mockFunction1(this));
            },
        });
        beforeEach(() => {
            instance = combine(CallbackTestObjectType)();
        });

        it('should have called beforeValidate', () => {
            return instance
                .then((props) => {
                    expect(mockFunction1).toHaveBeenCalledWith(props);
                });
        });

    });

    describe('multi inheritance', () => {
        const SecondaryTestObjectType = (props) => ({
            ...props,
            bar: 'baz',
        });
        beforeEach(() => {
            instance = combine(BasicTestObjectType, SecondaryTestObjectType)();
        });

        it('sets the correct objectType', () => {
            return instance
                .then((props) => (expect(props.objectType).toEqual('SecondaryTestObjectType')));
        });

        it('merges the traits of both inherited types', () => {
            return instance
                .then((props) => {
                    expect(props.foo).toEqual('bar');
                    expect(props.bar).toEqual('baz');
                });
        });

        it('overwrites traits of higher up the chain with traits defined lower down', () => {
            const ThirdTestObjectType = (props) => ({
                ...props,
                foo: 'bing',
            });

            instance = combine(BasicTestObjectType, SecondaryTestObjectType,ThirdTestObjectType)();

            return instance
                .then((props) => {
                    expect(props.foo).toEqual('bing');
                    expect(props.bar).toEqual('baz');
                });
        });
    });
});
