import { Theme, useMediaQuery as muiUseMediaQuery } from '@mui/material';

export function useMediaQuery(query: string | ((theme: Theme) => string)): boolean {
    if (process.env.VENDOR === 'firefox') {
        return muiUseMediaQuery(query, { matchMedia: window.matchMedia.bind(window) } as {});
    } else {
        return muiUseMediaQuery(query);
    }
}
