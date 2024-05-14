import { ConfigKey, addOnConfigChangeListener } from "./config";

export type DeclarativeNetRequestRule = Omit<
    NonNullable<browser.declarativeNetRequest._UpdateSessionRulesOptions["addRules"]>[number],
    "id"
>;

let nextRuleId = 1;

/**
 * 指定したConfigKeyが有効なときに適用されるDeclarative Net Requestルールを登録する。
 * ルールのidを動的に割り当てているため、この関数はバックグラウンドスクリプトの初期化時に無条件に呼び出す必要がある。
 *
 * @param configKey - ConfigKey
 * @param rules - Declarative Net Requestルール
 */
export function registerNetRequestRules(configKey: ConfigKey, rules: DeclarativeNetRequestRule[]): void {
    const ruleIds = rules.map(() => nextRuleId++);

    const rulesWithId = rules.map((rule, index) => ({
        id: ruleIds[index],
        ...rule,
    }));

    addOnConfigChangeListener(
        configKey,
        (value) => {
            if (value) {
                browser.declarativeNetRequest.updateSessionRules({
                    addRules: rulesWithId,
                    removeRuleIds: ruleIds,
                });
            } else {
                browser.declarativeNetRequest.updateSessionRules({
                    removeRuleIds: ruleIds,
                });
            }
        },
        true
    );
}
