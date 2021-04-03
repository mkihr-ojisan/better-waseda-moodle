import Collapse from '@material-ui/core/Collapse';
import Alert, { Color } from '@material-ui/lab/Alert';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

type Props = {
    severity: Color;
    open: boolean;
    onClose: () => void;
    timeout?: number;
    children?: ReactNode;
};

export default function AutoCloseAlert(props: Props): ReactElement | null {
    const [onCloseFunc] = useState(() => props.onClose);
    const [timeout] = useState(props.timeout ?? 3000);

    useEffect(() => {
        if (props.open) {
            const timeoutId = setTimeout(onCloseFunc, timeout);
            return () => clearTimeout(timeoutId);
        }
    }, [onCloseFunc, props.open, timeout]);

    return (
        <Collapse in={props.open}>
            <Alert severity={props.severity}>
                {props.children}
            </Alert>
        </Collapse>
    );
}
