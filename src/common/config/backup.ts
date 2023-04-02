import { compressObject, decompressObject } from "../util/object-compression";
import { ConfigKey, CONFIG_VALUE_TYPE_DEF } from "./config";

/**
 * configを文字列としてエクスポートする。ログイン情報は含まれない。
 */
export async function exportConfig(): Promise<string> {
    const obj = Object.fromEntries(
        Object.entries(await browser.storage.sync.get()).map(([key, value]) => {
            const k = parseInt(key) as ConfigKey;
            return [ConfigKey[k], decompressObject(CONFIG_VALUE_TYPE_DEF[k], value)];
        })
    );
    // ログイン情報は含めない
    delete obj[ConfigKey[ConfigKey.LoginInfo]];
    return JSON.stringify(obj, null, 4);
}

/**
 * configをインポートする。
 *
 * @param config - エクスポートされたconfig
 */
export async function importConfig(config: string): Promise<void> {
    const obj = JSON.parse(config);
    const compressedObj = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            const k = ConfigKey[key as keyof typeof ConfigKey];
            if (k === undefined) throw new Error(`Unknown key: ${key}`);
            return [k, compressObject(CONFIG_VALUE_TYPE_DEF[k], value as any)];
        })
    );
    await browser.storage.sync.set(compressedObj);
}
