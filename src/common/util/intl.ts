/**
 * 拡張機能のロケールを取得する。この拡張機能が対応していないロケールの場合は、manifest.jsonで指定したデフォルトのロケールを返す。
 *
 * @returns 拡張機能のロケール
 */
export function getExtensionLocale(): string {
    return browser.i18n.getMessage("locale");
}

export class DateTimeFormat extends Intl.DateTimeFormat {
    constructor(options: Intl.DateTimeFormatOptions) {
        super(getExtensionLocale(), options);
    }
}

export class RelativeTimeFormat extends Intl.RelativeTimeFormat {
    constructor(options: Intl.RelativeTimeFormatOptions) {
        super(getExtensionLocale(), options);
    }
}

export class NumberFormat extends Intl.NumberFormat {
    constructor(options: Intl.NumberFormatOptions) {
        super(getExtensionLocale(), options);
    }
}

export class PluralRules extends Intl.PluralRules {
    constructor(options?: Intl.PluralRulesOptions) {
        super(getExtensionLocale(), options);
    }
}
