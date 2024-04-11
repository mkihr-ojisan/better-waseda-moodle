import { assertExtensionContext } from "../util/context";
import { compareVersion } from "../util/version";
import { ConfigKey } from "./config";

assertExtensionContext("background");

/** 旧バージョンのconfigを移行する。 */
export async function migrateConfig(): Promise<void> {
    const configVersion =
        (await browser.storage.sync.get(ConfigKey.LastVersion.toString()))[ConfigKey.LastVersion.toString()] ?? "0";
    const version = browser.runtime.getManifest().version;

    if (compareVersion(configVersion, version) > 0) {
        throw Error(`Config version is newer than extension version: ${configVersion} > ${version}`);
    } else if (configVersion === version) {
        return;
    }

    let compressedNewConfig: Record<string, unknown>;
    if (compareVersion(configVersion, "0.6.0") >= 0) {
        compressedNewConfig = {
            ...(await browser.storage.sync.get()),
            [ConfigKey.LastVersion]: version,
        };
    } else {
        // 0.6.0より前のバージョンは面倒なので全消去
        compressedNewConfig = {
            [ConfigKey.LastVersion]: version,
        };
    }

    if (compareVersion(configVersion, "0.7.0") < 0) {
        // TimelineHiddenCoursesがnumber[]だったのをstring[]に変更
        if (compressedNewConfig[ConfigKey.TimelineHiddenCourses]) {
            compressedNewConfig[ConfigKey.TimelineHiddenCourses] = (
                compressedNewConfig[ConfigKey.TimelineHiddenCourses] as number[]
            ).map((x) => x.toString());
        }
    }

    await browser.storage.sync.clear();
    await browser.storage.sync.set(compressedNewConfig);
}
