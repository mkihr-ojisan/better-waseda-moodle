import * as dateFns from 'date-fns';
import ja from 'date-fns/locale/ja';

function getLocale(): Locale | undefined {
    return { ja }[browser.i18n.getUILanguage().split('-')[0]];
}

export function format(
    date: number | Date,
    format: string,
    options?:
        | {
              locale?: globalThis.Locale | undefined;
              weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
              firstWeekContainsDate?: number | undefined;
              useAdditionalWeekYearTokens?: boolean | undefined;
              useAdditionalDayOfYearTokens?: boolean | undefined;
          }
        | undefined
): string {
    options = options ?? {};
    options.locale = getLocale();
    return dateFns.format(date, format, options);
}

export function formatDistanceToNowStrict(
    date: number | Date,
    options?:
        | {
              includeSeconds?: boolean | undefined;
              addSuffix?: boolean | undefined;
              locale?: globalThis.Locale | undefined;
          }
        | undefined
): string {
    options = options ?? {};
    options.locale = getLocale();
    return dateFns.formatDistanceToNowStrict(date, options);
}
