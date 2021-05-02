import equal from 'fast-deep-equal';

const CONFIG_SYNC_ENABLED_CONFIG_KEY = 'config.sync.enabled';

export async function isConfigSyncEnabled(): Promise<boolean> {
    return (await browser.storage.local.get(CONFIG_SYNC_ENABLED_CONFIG_KEY))[CONFIG_SYNC_ENABLED_CONFIG_KEY] ?? false;
}

export async function enableConfigSync(mode: 'discard_local' | 'force_upload'): Promise<void> {
    if (await isConfigSyncEnabled()) return;

    if (mode === 'force_upload') {
        const config = await browser.storage.local.get();
        delete config[CONFIG_SYNC_ENABLED_CONFIG_KEY];
        await browser.storage.sync.set(config);
    }

    await browser.storage.local.clear();
    await browser.storage.local.set({ [CONFIG_SYNC_ENABLED_CONFIG_KEY]: true });

    browser.runtime.reload();
}

export async function disableConfigSync(): Promise<void> {
    if (!await isConfigSyncEnabled()) return;

    await browser.storage.local.set(await browser.storage.sync.get());
    await browser.storage.local.set({ [CONFIG_SYNC_ENABLED_CONFIG_KEY]: false });

    browser.runtime.reload();
}

export async function checkConflictWhenEnablingConfigSync(): Promise<boolean> {
    const [local, sync] = await Promise.all([browser.storage.local.get(), browser.storage.sync.get()]);
    if (Object.keys(sync).length === 0) {
        return false;
    } else if (equal(local, sync)) {
        return false;
    } else {
        return true;
    }
}