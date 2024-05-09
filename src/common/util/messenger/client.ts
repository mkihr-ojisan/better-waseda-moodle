import { MessengerResponse, messengerCommands } from "./server";

/**
 * 指定したコマンドをMessengerServerで実行する
 *
 * @param command - 実行するコマンド
 * @param args - コマンドに渡す引数
 * @returns コマンドの実行結果
 */
export async function call<T extends keyof typeof messengerCommands>(
    command: T,
    ...args: Parameters<(typeof messengerCommands)[T]>
): Promise<Awaited<ReturnType<(typeof messengerCommands)[T]>>> {
    const result = (await browser.runtime.sendMessage({ command, args })) as MessengerResponse<T>;

    if ("ret" in result) {
        return result.ret;
    } else if ("error" in result) {
        throw new Error(result.error);
    } else if ("generator" in result) {
        const id = result.generator.id;
        return (async function* () {
            let nextArg: any = undefined;
            while (true) {
                const nextResult = (await browser.runtime.sendMessage({
                    generatorNext: { id, value: nextArg },
                })) as MessengerResponse<T>;
                if ("generatorNext" in nextResult) {
                    const { value, done } = nextResult.generatorNext;
                    if (done) {
                        return value;
                    } else {
                        // @ts-ignore
                        nextArg = yield value;
                    }
                } else {
                    throw new Error("unexpected response");
                }
            }
        })() as any;
    } else {
        throw new Error("unexpected response");
    }
}
