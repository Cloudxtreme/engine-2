const Bluebird = require("bluebird");

import { combine } from "./ObjectType";

const mockFunction1 = jest.fn();

describe("combine", () => {
    const BasicTestObjectType = props => ({
        ...props,
        foo: "bar"
    });

    let instance;
    beforeEach(() => {
        instance = combine(BasicTestObjectType)();
    });

    it("builds an object with the correct objectType", () => {
        return instance.then(props => expect(props.objectType).toEqual("BasicTestObjectType"));
    });

    it("sets a uuid", () => {
        return instance.then(props => expect(props.uuid).toBeDefined());
    });

    it("sets a key", () => {
        return instance.then(props =>
            expect(props.key).toEqual(`basic-test:${props.uuid.slice(-5)}`)
        );
    });

    it("sets createdAt", () => {
        return instance.then(props => expect(props.createdAt).toBeDefined());
    });

    it("sets updatedAt", () => {
        return instance.then(props => expect(props.updatedAt).toBeDefined());
    });

    describe("beforeValidate", () => {
        const CallbackTestObjectType = props => ({
            ...props,
            beforeValidate() {
                return Bluebird.resolve(mockFunction1(this));
            }
        });
        beforeEach(() => {
            instance = combine(CallbackTestObjectType)();
        });

        it("should have called beforeValidate", () => {
            return instance.then(props => {
                expect(mockFunction1).toHaveBeenCalledWith(props);
            });
        });
    });

    describe("afterValidate", () => {
        const CallbackTestObjectType = props => ({
            ...props,
            afterValidate() {
                return Bluebird.resolve(mockFunction1());
            }
        });

        beforeEach(() => {
            instance = combine(CallbackTestObjectType)();
        });

        it("should have called afterValidate", () => {
            return instance.then(() => expect(mockFunction1).toHaveBeenCalled() )
        })
    });

    describe("multi inheritance", () => {
        const SecondaryTestObjectType = props => ({
            ...props,
            bar: "baz"
        });
        beforeEach(() => {
            instance = combine(BasicTestObjectType, SecondaryTestObjectType)();
        });

        it("sets the correct objectType", () => {
            return instance.then(props =>
                expect(props.objectType).toEqual("SecondaryObjectType")
            );
        });

        it("returns the correct responses for inherits", () => {
            return instance.then(props => {
                    expect(props.inherits('BasicTestObjectType')).toBeTruthy();
                    expect(props.inherits(SecondaryTestObjectType)).toBeTruthy();
                    expect(props.inherits('NotAnObjectType')).toBeFalsy()
                }
            );
        })

        it("merges the traits of both inherited types", () => {
            return instance.then(props => {
                expect(props.foo).toEqual("bar");
                expect(props.bar).toEqual("baz");
            });
        });

        it("overwrites traits of higher up the chain with traits defined lower down", () => {
            const ThirdTestObjectType = props => ({
                ...props,
                foo: "bing"
            });

            instance = combine(BasicTestObjectType, SecondaryTestObjectType, ThirdTestObjectType)();

            return instance.then(props => {
                expect(props.foo).toEqual("bing");
                expect(props.bar).toEqual("baz");
            });
        });
    });

    describe("validation", () => {
        const PrimaryObjectType = traits => ({
            schema: {
                foo: {
                    presence: true
                }
            },
            ...traits
        });

        const SeocondaryObjectType = traits => ({
            schema: {
                baz: {
                    presence: true
                }
            },
            ...traits
        });

        it("runs validations", () => {
            return expect(combine(PrimaryObjectType)()).rejects.toEqual({
                foo: ["Foo can't be blank"]
            });
        });

        describe("nested object validation", () => {
            const NestedObjectType = traits => ({
                schema: {
                    bar: {
                        objectType: true
                    }
                },
                ...traits
            });

            const ArrayObjectType = traits => ({
                schema: {
                    bar: {
                        objectType: "array"
                    }
                },
                ...traits
            });

            const ObjectObjectType = traits => ({
                schema: {
                    bar: {
                        objectType: "object"
                    }
                },
                ...traits
            });

            it("validates the nested objects", () => {
                return expect(
                    combine(NestedObjectType)({
                        bar: combine(PrimaryObjectType)()
                    })
                ).rejects.toEqual(
                    expect.objectContaining({ bar: [{ foo: ["Foo can't be blank"] }] })
                );
            });

            it("validates an array of nested objects", () => {
                return expect(
                    combine(ArrayObjectType)({
                        bar: [combine(PrimaryObjectType)(), combine(SeocondaryObjectType)()]
                    })
                ).rejects.toEqual(
                    expect.objectContaining({
                        bar: [{ baz: ["Baz can't be blank"], foo: ["Foo can't be blank"] }]
                    })
                );
            });

            it("validates an object of nested objects", () => {
                return expect(
                    combine(ObjectObjectType)({
                        bar: {
                            one: combine(PrimaryObjectType)(),
                            two: combine(SeocondaryObjectType)()
                        }
                    })
                ).rejects.toEqual(
                    expect.objectContaining({
                        bar: [{ baz: ["Baz can't be blank"], foo: ["Foo can't be blank"] }]
                    })
                );
            });
        });
    });
});
