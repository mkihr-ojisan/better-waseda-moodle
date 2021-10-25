import { ExPromise, PromiseProgressEvent } from './ExPromise';

export class MessengerServer {
    private static instructions: { [key: string]: Function } = {};
    private static pendingExPromises: { [key: number]: ExPromise<unknown, unknown, unknown> } = {};
    static init(): void {
        browser.runtime.onConnect.addListener((port) => {
            port.onMessage.addListener((message: any) => {
                (async () => {
                    const inst = message.inst;
                    const args = message.args;
                    const id = message.id;

                    switch (inst) {
                        case '__cancel':
                            this.pendingExPromises[id]?.cancel(args);
                            break;
                        default:
                            try {
                                const value = this.instructions[inst].apply(undefined, args);
                                if (value instanceof ExPromise) {
                                    this.pendingExPromises[id] = value;
                                    value.addEventListener('progress', (event) => {
                                        port.postMessage({
                                            inst: '__retProgress',
                                            value: (event as PromiseProgressEvent<any>).progress,
                                            id,
                                        });
                                    });
                                    value.cachedValue.then((cachedValue) => {
                                        port.postMessage({
                                            inst: '__retCache',
                                            value: cachedValue,
                                            id,
                                        });
                                    });
                                    port.postMessage({
                                        inst: '__retOk',
                                        value: await value,
                                        id,
                                    });
                                    delete this.pendingExPromises[id];
                                } else {
                                    port.postMessage({
                                        inst: '__retOk',
                                        value: await value,
                                        id,
                                    });
                                }
                            } catch (error) {
                                console.error(`Error while executing instruction '${inst}'`, error);
                                port.postMessage({
                                    inst: '__retErr',
                                    value: `${error}`,
                                    id,
                                });
                            }
                            break;
                    }
                })();
            });
        });
    }
    static addInstruction(functions: Record<string, Function>): void {
        for (const [name, f] of Object.entries(functions)) {
            if (name in this.instructions) {
                throw new Error(`Instruction '${name}' already exists`);
            }
            this.instructions[name] = f;
        }
    }
}

export class MessengerClient {
    private static promises: {
        [key: number]: {
            resolve: (value: any) => void;
            reject: (reason: any) => void;
            resolveCache?: (value: any) => void;
            checkCancelled?: (handler: ((reason: any) => boolean) | undefined) => void;
            reportProgress?: (progress: any) => void;
        };
    } = {};
    private static port: browser.runtime.Port;
    private static initialized = false;
    private static init() {
        this.port = browser.runtime.connect();

        this.port.onMessage.addListener((message: any) => {
            const inst = message.inst;
            const id = message.id;
            switch (inst) {
                case '__retOk':
                    this.promises[id].resolve(message.value);
                    delete this.promises[id];
                    break;
                case '__retErr':
                    this.promises[id].reject(Error(message.value));
                    delete this.promises[id];
                    break;
                case '__retProgress':
                    this.promises[id].reportProgress?.(message.value);
                    break;
                case '__retCache':
                    this.promises[id].resolveCache?.(message.value);
                    break;
                default:
                    throw new Error(`unknown instruction '${inst}'`);
            }
        });

        this.initialized = true;
    }

    static exec(inst: string, ...args: any[]): ExPromise<any, any, any> {
        if (!this.initialized) this.init();

        const id = Math.random();
        const promise = new ExPromise(
            (resolve, reject, resolveCache, checkCancelled, reportProgress) =>
                (this.promises[id] = { resolve, reject, resolveCache, checkCancelled, reportProgress })
        );
        promise.cancel = (reason) => {
            this.port.postMessage({
                inst: '__cancel',
                args: reason,
                id,
            });
        };

        this.port.postMessage({
            inst,
            args,
            id,
        });

        return promise;
    }
}
