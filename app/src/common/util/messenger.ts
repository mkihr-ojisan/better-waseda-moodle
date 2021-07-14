export class MessengerServer {
    private static instructions: { [key: string]: Function } = {};
    static init(): void {
        browser.runtime.onConnect.addListener((port) => {
            port.onMessage.addListener((message: any) => {
                (async () => {
                    const inst = message.inst;
                    const args = message.args;
                    const id = message.id;

                    try {
                        const ret = await this.instructions[inst].apply(undefined, args);
                        port.postMessage({
                            inst: '__retOk',
                            ret,
                            id,
                        });
                    } catch (error) {
                        console.error(`Error while executing instruction '${inst}'`, error);
                        port.postMessage({
                            inst: '__retErr',
                            error: error.message,
                            id,
                        });
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
    private static promises: { [key: number]: { resolve: Function; reject: Function } } = {};
    private static port: browser.runtime.Port;
    private static initialized = false;
    private static init() {
        this.port = browser.runtime.connect();

        this.port.onMessage.addListener((message: any) => {
            const inst = message.inst;
            const id = message.id;

            switch (inst) {
                case '__retOk':
                    this.promises[id].resolve(message.ret);
                    break;
                case '__retErr':
                    this.promises[id].reject(Error(message.error));
                    break;
                default:
                    throw new Error(`unknown instruction '${inst}'`);
            }
            delete this.promises[id];
        });

        this.initialized = true;
    }

    static exec(inst: string, ...args: any[]): Promise<any> {
        if (!this.initialized) this.init();

        const id = Date.now();
        const promise = new Promise((resolve, reject) => (this.promises[id] = { resolve, reject }));
        this.port.postMessage({
            inst,
            args,
            id,
        });

        return promise;
    }
}
