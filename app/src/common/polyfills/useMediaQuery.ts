import { Theme, useMediaQuery as muiUseMediaQuery } from '@material-ui/core';

export function useMediaQuery(query: string | ((theme: Theme) => string)): boolean {
    // #!blink_only
    return muiUseMediaQuery(query);
    // #!firefox_only
    return muiUseMediaQuery(query, { matchMedia: window.matchMedia.bind(window) } as {});
}