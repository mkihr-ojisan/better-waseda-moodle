import registerContentScript from '../../common/config/registerContentScript';

export function initMaintenanceInfo(): void {
    registerContentScript('maintenanceInfo.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/my/'],
        js: [{ file: 'src/others/maintenance-info/content-script.js' }],
        runAt: 'document_idle',
    });
}
