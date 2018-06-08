import { EventEmitter as Emitter } from "events";
import { TConstructor } from "../";

// tslint:disable-next-line:function-name
export function EventEmitterObjectTrait<TBase extends TConstructor>(Base: TBase) {
    return class extends Base {
        private readonly emitter: Emitter = new Emitter();

        on(event: string, cb: Function) {
            this.emitter.on(event, cb);
        }

        emit(event: string, ...args: any[]) {
            this.emitter.emit(event, ...args);
        }
    };
}
