import { deserializeError } from "@/common/error";
import { Lazy, lazy } from "../lazy";
import { messengerCommands } from "./server";

/**
 * バックグラウンドスクリプトと通信するポート
 */
const messengerPort: Lazy<browser.runtime.Port> = lazy(() => {
    return browser.runtime.connect();
});

/**
 * 指定したコマンドをMessengerServerで実行する
 *
 * @param command - 実行するコマンド
 * @param args - コマンドに渡す引数
 * @returns コマンドの実行結果
 */
export function call<T extends keyof typeof messengerCommands>(
    command: T,
    ...args: Parameters<(typeof messengerCommands)[T]>
): Promise<Awaited<ReturnType<(typeof messengerCommands)[T]>>> {
    const port = messengerPort.get();

    const id = Math.random().toString(36).slice(2);
    const promise = new Promise<Awaited<ReturnType<(typeof messengerCommands)[T]>>>((resolve, reject) => {
        const listener = (message: any): void => {
            if (message.id === id) {
                port.onMessage.removeListener(listener);
                if ("iter" in message) {
                    const iterator = (async function* (): AsyncGenerator<unknown, unknown, unknown> {
                        let _next: unknown = undefined;
                        while (true) {
                            const value = await new Promise<any>((resolve, reject) => {
                                const listener = (message: any): void => {
                                    if (message.id === id) {
                                        port.onMessage.removeListener(listener);
                                        if ("iter_next" in message) {
                                            resolve(message.iter_next.value);
                                        } else if ("error" in message) {
                                            reject(deserializeError(message.error));
                                        } else {
                                            console.error("invalid message", message);
                                        }
                                    }
                                };
                                port.onMessage.addListener(listener);
                                port.postMessage({ id, iter_next: { value: _next } });
                            });
                            if (value.done) {
                                return value.value;
                            } else {
                                _next = (yield value.value) as unknown;
                            }
                        }
                    })();

                    resolve(iterator as any);
                } else if ("ret" in message) {
                    resolve(message.ret.value);
                } else if ("error" in message) {
                    reject(deserializeError(message.error));
                } else {
                    console.error("invalid message", message);
                }
            }
        };
        port.onMessage.addListener(listener);
        port.postMessage({ id, command, args });
    });
    return promise;
}
