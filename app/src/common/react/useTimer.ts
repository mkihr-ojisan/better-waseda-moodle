import { useEffect } from 'react';

export default function useTimer(enabled: boolean, ms: number, callback: () => void): void {
    useEffect(() => {
        if (enabled) {
            const timeoutId = setTimeout(callback, ms);
            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, ms]);
}
