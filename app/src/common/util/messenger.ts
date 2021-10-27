export class MessengerServer {
    private static instructions: { [key: string]: Function } = {};
    static init(): void {
        browser.runtime.onConnect.addListener((port) => {
            let isDisconnected = false;
            port.onDisconnect.addListener(() => {
                isDisconnected = true;
            });

            port.onMessage.addListener((message: any) => {
                (async () => {
                    const inst = message.inst;
                    const args = message.args;
                    const id = message.id;

                    try {
                        const value = await this.instructions[inst].apply(undefined, args);

                        if (
                            typeof value === 'object' &&
                            (Symbol.iterator in value || Symbol.asyncIterator in value) &&
                            'next' in value
                        ) {
                            port.postMessage({
                                inst: '__retGenerator',
                                id,
                            });

                            while (!isDisconnected) {
                                const next = await value.next();
                                port.postMessage({
                                    inst: '__retGeneratorNext',
                                    id,
                                    value: {
                                        done: next.done,
                                        value: next.value,
                                    },
                                });
                                if (next.done) {
                                    break;
                                }
                            }
                        } else {
                            if (!isDisconnected) {
                                port.postMessage({
                                    inst: '__retOk',
                                    value,
                                    id,
                                });
                            }
                        }
                    } catch (error) {
                        console.error(`Error while executing instruction '${inst}'`, error);

                        try {
                            if (!isDisconnected) {
                                port.postMessage({
                                    inst: '__retErr',
                                    value: `${error}`,
                                    id,
                                });
                            }
                        } catch (error) {
                            // たぶんポートが閉じられている
                        }
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
        };
    } = {};
    private static generators: {
        [key: number]: {
            resolve: (value: any) => void;
            reject: (reason: any) => void;
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
                case '__retGenerator': {
                    let promise = new Promise((resolve, reject) => {
                        MessengerClient.generators[id] = { resolve, reject };
                    });

                    const generator = async function* () {
                        for (;;) {
                            const { value, done } = (await promise) as { value: any; done: boolean };
                            if (done) {
                                return value;
                            } else {
                                yield value;
                            }
                            promise = new Promise((resolve, reject) => {
                                MessengerClient.generators[id] = { resolve, reject };
                            });
                        }
                    };
                    this.promises[id].resolve(generator());
                    delete this.promises[id];
                    break;
                }
                case '__retGeneratorNext':
                    this.generators[id].resolve(message.value);
                    if (message.value.done) {
                        delete this.generators[id];
                    }
                    break;
                default:
                    throw new Error(`unknown instruction '${inst}'`);
            }
        });

        this.initialized = true;
    }

    static exec(inst: string, ...args: any[]): Promise<unknown> {
        if (!this.initialized) this.init();

        const id = Math.random();
        const promise = new Promise((resolve, reject) => (this.promises[id] = { resolve, reject }));

        this.port.postMessage({
            inst,
            args,
            id,
        });

        return promise;
    }
}
