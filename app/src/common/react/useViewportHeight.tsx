import { useEffect, useState } from 'react';

export default function useViewportHeight(): number {
    const [state, setState] = useState(document.documentElement.clientHeight);

    useEffect(() => {
        const listener = () => {
            setState(document.documentElement.clientHeight);
        };
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    }, []);

    return state;
}
