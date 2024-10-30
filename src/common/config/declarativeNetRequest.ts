import { ConfigKey, addOnConfigChangeListener } from "./config";

export type DeclarativeNetRequestRule = Omit<
    NonNullable<browser.declarativeNetRequest._UpdateSessionRulesOptions["addRules"]>[number],
    "id"
>;

/**
 * 指定したConfigKeyが有効なときに適用されるDeclarative Net Requestルールを登録する。
 *
 * @param configKey - ConfigKey
 * @param rulesetId - 有効・無効を切り替えるrulesetのid
 */
export function registerNetRequestRules(configKey: ConfigKey, rulesetId: string): void {
    addOnConfigChangeListener(
        configKey,
        (value) => {
            if (value) {
                browser.declarativeNetRequest.updateEnabledRulesets({
                    enableRulesetIds: [rulesetId],
                });
            } else {
                browser.declarativeNetRequest.updateEnabledRulesets({
                    disableRulesetIds: [rulesetId],
                });
            }
        },
        true
    );
}
