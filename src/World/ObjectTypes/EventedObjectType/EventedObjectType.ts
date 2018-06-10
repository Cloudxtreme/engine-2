import { EventEmitter } from "events";

import { ObjectType } from "../";

export interface IEventedObjectType {
    on(event: string, cb: Function): void;
    emit(event: string, ...args: any[]): void;
}

export class EventedObjectType extends ObjectType
    implements IEventedObjectType {
    private readonly emitter: Emitter = new EventEmitter();

    on(event: string, cb: Function) {
        this.emitter.on(event, cb);
    }

    emit(event: string, ...args: any[]) {
        this.emitter.emit(event, ...args);
    }
}
