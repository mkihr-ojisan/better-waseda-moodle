import { ListProps } from '@mui/material';
import List from '@mui/material/List';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles(() => ({
    root: {
        padding: 0,
    },
}));

export default React.memo(function NoPaddingList(props: ListProps) {
    const classes = useStyles();
    return <List {...props} classes={{ root: classes.root }} />;
});
