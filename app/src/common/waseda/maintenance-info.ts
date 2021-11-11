export const MAINTENANCE_INFO_ORIGIN = 'https://data.better-waseda-moodle.tk/*';
export const MAINTENANCE_INFO_URL = 'https://data.better-waseda-moodle.tk/maintenance-info.json';

export type MaintenanceInfo = {
    message: {
        messageName: string;
        substitutions?: string[];
    };
    startTime: Date;
    endTime: Date | undefined;
    detailUrl: string | undefined;
};

type MaintenanceInfoJson = {
    message: {
        messageName: string;
        substitutions?: string[];
    };
    startTime: string;
    endTime?: string;
    detailUrl?: string;
};

export async function fetchMaintenanceInfo(): Promise<MaintenanceInfo[]> {
    const json: MaintenanceInfoJson[] = await (await fetch(MAINTENANCE_INFO_URL)).json();

    return json.map((item) => ({
        message: item.message,
        startTime: new Date(item.startTime),
        endTime: item.endTime ? new Date(item.endTime) : undefined,
        detailUrl: item.detailUrl,
    }));
}
