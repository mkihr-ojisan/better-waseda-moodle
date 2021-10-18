import Box from '@mui/material/Box';
import React, { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
};

export default React.memo(function Indent(props: Props) {
    return <Box ml={4}>{props.children}</Box>;
});
