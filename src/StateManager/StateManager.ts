import {
    fromJS,
    Map,
} from 'immutable';
import {GenericObject} from 'moleculer';

/**
 * A simple manager for immutable states.
 */
export class StateManager {
    // tslint:disable-next-line:no-any
    private state: Map<string, any>;

    constructor(initialState: GenericObject) {
        this.state = fromJS(initialState);
    }

    /**
     * Gets the provided dot notation key from the state.
     * @param {string} key dot notation key.
     * @returns {any}
     */
    // tslint:disable-next-line:no-any
    public getIn(key: string): any {
        return this.state.getIn(key.split('.'));
    }

    /**
     * Sets the provided state in the provided dot notation key location. Passed in values are processed by fromJS
     * @param {string} key dot notation key
     * @param value the value to set
     */
    // tslint:disable-next-line:no-any
    public setIn(key: string, value: any): void {
        this.state = this.state.setIn(key.split('.'), fromJS(value));
    }
}
