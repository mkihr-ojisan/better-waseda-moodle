import equal from 'fast-deep-equal';
import { CourseOverviewType } from '../../course-overview/components/CourseOverview';
import { InternalError } from '../error';
import { ObjectValuesDeepReadonly } from '../util/types';
import { YearTerm } from '../waseda/course/course';
import { CourseDataEntry } from '../waseda/course/course-data';
import AsyncLock from 'async-lock';

export type ConfigKey = keyof Config;
export type ConfigKeyWithType<T> = {
    [P in keyof Config]: ConfigValue<P> extends T ? (T extends ConfigValue<P> ? P : never) : never;
}[keyof Config];
export type ConfigValue<T extends ConfigKey> = Config[T];
export type Config = ObjectValuesDeepReadonly<{
    'config.sync.enabled': boolean;
    'autoLogin.enabled': boolean;
    'autoLogin.loginId': string;
    'autoLogin.password': string;
    'removeLoadingVideo.enabled': boolean;
    'viewInBrowser.enabled': boolean;
    'checkNotesOnSubmitting.enabled': boolean;
    'moreVisibleRemainingTime.enabled': boolean;
    'disableRateLimit.enabled': boolean;
    'courseOverview.enabled': boolean;
    'courseOverview.type': CourseOverviewType;
    'timetable.selectedTerm': YearTerm | null;
    'timetable.showPeriodTime': boolean;
    'hideName.enabled': boolean;
    'syllabusLinkFix.enabled': boolean;
    courseData: Record<number, CourseDataEntry | undefined>;
    'quiz.remindUnansweredQuestions.enabled': boolean;
    'quiz.remindUnansweredQuestions.sequentialQuizOnly': boolean;
    'checkSession.enabled': boolean;
    'checkSession.quiz': boolean;
    'checkSession.assignment': boolean;
    'checkSession.forum': boolean;
    'todo.hiddenItems': { courses: number[]; ids: number[]; modules: string[] };
    'todo.hideItemNoticeShown': boolean;
}>;

export const defaultValue: Config = {
    'config.sync.enabled': false,
    'autoLogin.enabled': false,
    'autoLogin.loginId': '',
    'autoLogin.password': '',
    'removeLoadingVideo.enabled': true,
    'viewInBrowser.enabled': false,
    'checkNotesOnSubmitting.enabled': true,
    'moreVisibleRemainingTime.enabled': true,
    'disableRateLimit.enabled': true,
    'courseOverview.enabled': true,
    'courseOverview.type': 'timetable',
    'timetable.selectedTerm': null,
    'timetable.showPeriodTime': false,
    'hideName.enabled': false,
    'syllabusLinkFix.enabled': true,
    courseData: {},
    'quiz.remindUnansweredQuestions.enabled': true,
    'quiz.remindUnansweredQuestions.sequentialQuizOnly': true,
    'checkSession.enabled': true,
    'checkSession.quiz': true,
    'checkSession.assignment': true,
    'checkSession.forum': true,
    'todo.hiddenItems': { courses: [], ids: [], modules: [] },
    'todo.hideItemNoticeShown': false,
};

export async function getConfigAsync<T extends ConfigKey>(key: T): Promise<ConfigValue<T>> {
    if (key === 'config.sync.enabled') {
        return getIsConfigSyncEnabled() as Promise<ConfigValue<T>>;
    }

    return (await browser.storage[(await getIsConfigSyncEnabled()) ? 'sync' : 'local'].get(key))[key];
}
export async function setConfigAsync<T extends ConfigKey>(key: T, value: ConfigValue<T>): Promise<void> {
    if (key === 'config.sync.enabled') throw new InternalError('use `enableConfigSync` or `disableConfigSync` instead');

    return await browser.storage[(await getIsConfigSyncEnabled()) ? 'sync' : 'local'].set({ [key]: value });
}

let cache: Partial<Config> | undefined;
let syncEnabled: boolean | undefined;
const listeners: { [key: string]: ((oldValue: any | undefined, newValue: any | undefined, key: any) => void)[] } = {};
const lock = new AsyncLock();

export async function initConfigCache(): Promise<void> {
    syncEnabled = await getIsConfigSyncEnabled();
    cache = (await browser.storage[syncEnabled ? 'sync' : 'local'].get()) as Partial<Config>;
    browser.storage.onChanged.addListener(onStorageChanged);
}

async function getIsConfigSyncEnabled(): Promise<boolean> {
    return (await browser.storage.local.get('config.sync.enabled'))['config.sync.enabled'];
}

export function isConfigSyncEnabled(): boolean {
    if (syncEnabled === undefined) throw new InternalError('config cache not initialized');
    return syncEnabled;
}

function callConfigChangeListeners(oldConfig: Partial<Config>, newConfig: Partial<Config>): void {
    for (const key of Object.keys(defaultValue) as ConfigKey[]) {
        if (key === 'config.sync.enabled') continue;

        const oldValue = oldConfig[key] === undefined ? defaultValue[key] : oldConfig[key];
        const newValue = newConfig[key] === undefined ? defaultValue[key] : newConfig[key];

        if (!equal(oldValue, newValue)) {
            listeners[key]?.forEach((f) => f(oldValue, newValue, key));
        }
    }
}

async function onStorageChanged(
    changes: { [key: string]: browser.storage.StorageChange },
    areaName: string
): Promise<void> {
    lock.acquire('config', async () => {
        if (!cache) throw new InternalError('unreachable');

        if (
            areaName === 'local' &&
            'config.sync.enabled' in changes &&
            changes['config.sync.enabled'].newValue !== syncEnabled
        ) {
            syncEnabled = !!changes['config.sync.enabled'].newValue;
            const oldCache = cache;
            cache = (await browser.storage[syncEnabled ? 'sync' : 'local'].get()) as Partial<Config>;
            // 上のawaitの間にsetConfigされるとおかしくなりそう

            callConfigChangeListeners(oldCache, cache);
            listeners['config.sync.enabled']?.forEach((f) => f(!syncEnabled, syncEnabled, 'config.sync.enabled'));
            return;
        }

        if ((areaName === 'sync') !== syncEnabled) return;

        // listener内でgetConfigしても古い値が渡らないようにforを分ける
        for (const [key, change] of Object.entries(changes)) {
            (cache as any)[key] = change.newValue;
        }
        for (const [key, change] of Object.entries(changes)) {
            const oldValue = change.oldValue === undefined ? defaultValue[key as ConfigKey] : change.oldValue;
            const newValue = change.newValue === undefined ? defaultValue[key as ConfigKey] : change.newValue;

            if (!equal(oldValue, newValue)) {
                listeners[key]?.forEach((f) => f(oldValue, newValue, key));
            }
        }
    });
}

export function getConfig<T extends ConfigKey>(key: T): ConfigValue<T> {
    if (!cache) throw new InternalError('config cache not initialized');

    if (key === 'config.sync.enabled') return syncEnabled as ConfigValue<T>;

    const cacheValue = cache[key] as ConfigValue<T> | undefined;
    return cacheValue === undefined ? defaultValue[key] : cacheValue;
}
export function setConfig<T extends ConfigKey>(key: T, value: ConfigValue<T>): void {
    if (!cache) throw new InternalError('config cache not initialized');
    if (key === 'config.sync.enabled') throw new InternalError('use `enableConfigSync` or `disableConfigSync` instead');

    const oldValue = cache[key] === undefined ? defaultValue[key] : cache[key];

    if (equal(value, defaultValue[key])) {
        browser.storage[syncEnabled ? 'sync' : 'local'].remove(key);
        delete cache[key];
    } else {
        browser.storage[syncEnabled ? 'sync' : 'local'].set({ [key]: value });
        cache[key] = value;
    }

    if (!equal(oldValue, value)) {
        // ここで呼ばなくても上のonStorageChangedから呼ばれるが、Reactで使うときに同期的にlistenerが呼ばれたほうが嬉しい
        listeners[key]?.forEach((f) => f(oldValue, value, key));
    }
}
export function removeConfig<T extends ConfigKey>(key: T): void {
    if (!cache) throw new InternalError('config cache not initialized');
    if (key === 'config.sync.enabled') throw new InternalError('use `enableConfigSync` or `disableConfigSync` instead');

    const oldValue = cache[key] === undefined ? defaultValue[key] : cache[key];
    const newValue = defaultValue[key];

    browser.storage[syncEnabled ? 'sync' : 'local'].remove(key);
    delete cache[key];

    if (!equal(oldValue, newValue)) {
        // ここで呼ばなくても上のonStorageChangedから呼ばれるが、Reactで使うときに同期的にlistenerが呼ばれたほうが嬉しい
        listeners[key]?.forEach((f) => f(oldValue, newValue, key));
    }
}
export function onConfigChange<T extends ConfigKey>(
    key: T,
    listener: (oldValue: ConfigValue<T> | undefined, newValue: ConfigValue<T>, key: T) => void,
    initCall: boolean
): void {
    listeners[key] = listeners[key] ?? [];
    listeners[key].push(listener);
    if (initCall) listener(undefined, getConfig(key), key);
}

export function removeConfigChangeListener<T extends ConfigKey>(
    key: T,
    listener: (oldValue: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => void
): boolean {
    if (!listeners[key]) return false;
    const index = listeners[key].indexOf(listener);
    if (index === -1) return false;
    listeners[key].splice(index, 1);
    return true;
}

export function exportConfig(): Partial<Config> {
    if (!cache) throw new InternalError('config cache not initialized');

    const config: Partial<Config> = { ...cache };
    delete config['autoLogin.enabled'];
    delete config['autoLogin.loginId'];
    delete config['autoLogin.password'];

    config['config.sync.enabled'] = syncEnabled;

    return config;
}

export async function importConfig(config: Partial<Config>): Promise<void> {
    lock.acquire('config', async () => {
        if (!cache) throw new InternalError('config cache not initialized');

        browser.storage.onChanged.removeListener(onStorageChanged);

        try {
            const { 'config.sync.enabled': newSyncEnabled, ...others } = config;
            const oldSyncEnabled = syncEnabled;
            syncEnabled = newSyncEnabled;
            if (syncEnabled) {
                await browser.storage.local.clear();
                await browser.storage.local.set({ 'config.sync.enabled': true });
                await browser.storage.sync.clear();
                await browser.storage.sync.set(others);
            } else {
                await browser.storage.local.clear();
                await browser.storage.local.set(others);
            }

            const oldCache = cache;
            cache = others;
            callConfigChangeListeners(oldCache, cache);
            if (oldSyncEnabled !== newSyncEnabled)
                listeners['config.sync.enabled']?.forEach((f) =>
                    f(oldSyncEnabled, newSyncEnabled, 'config.sync.enabled')
                );
        } finally {
            browser.storage.onChanged.addListener(onStorageChanged);
        }
    });
}

export async function enableConfigSync(mode: 'discard_local' | 'force_upload'): Promise<void> {
    lock.acquire('config', async () => {
        if (syncEnabled) return;
        if (!cache) throw new InternalError('config cache not initialized');

        browser.storage.onChanged.removeListener(onStorageChanged);

        try {
            if (mode === 'force_upload') {
                await browser.storage.sync.clear();

                const config = await browser.storage.local.get();
                delete config['config.sync.enabled'];
                await browser.storage.sync.set(config);
            }

            await browser.storage.local.clear();
            await browser.storage.local.set({ ['config.sync.enabled']: true });

            syncEnabled = true;

            const oldCache = cache;
            cache = await browser.storage.sync.get();
            callConfigChangeListeners(oldCache, cache);
            listeners['config.sync.enabled']?.forEach((f) => f(!syncEnabled, syncEnabled, 'config.sync.enabled'));
        } finally {
            browser.storage.onChanged.addListener(onStorageChanged);
        }
    });
}

export async function disableConfigSync(): Promise<void> {
    lock.acquire('config', async () => {
        if (!syncEnabled) return;
        if (!cache) throw new InternalError('config cache not initialized');

        browser.storage.onChanged.removeListener(onStorageChanged);

        try {
            const oldCache = cache;
            cache = await browser.storage.sync.get();
            await browser.storage.local.set(cache);
            await browser.storage.local.set({ 'config.sync.enabled': false });

            syncEnabled = false;

            callConfigChangeListeners(oldCache, cache);
            listeners['config.sync.enabled']?.forEach((f) => f(!syncEnabled, syncEnabled, 'config.sync.enabled'));
        } finally {
            browser.storage.onChanged.addListener(onStorageChanged);
        }
    });
}

export async function checkConflictWhenEnablingConfigSync(): Promise<boolean> {
    const [local, sync] = await Promise.all([browser.storage.local.get(), browser.storage.sync.get()]);
    delete local['config.sync.enabled'];
    if (Object.keys(sync).length === 0) {
        return false;
    } else if (equal(local, sync)) {
        return false;
    } else {
        return true;
    }
}

export async function enableConfigSyncIfFirstRun(): Promise<void> {
    const local = await browser.storage.local.get();
    if (Object.keys(local).length === 0) {
        // storage.localが空だったら初めて拡張機能が実行されたとみなす
        await enableConfigSync('discard_local');
    }
}
