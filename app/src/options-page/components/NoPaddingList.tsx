import { ListProps } from '@material-ui/core';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
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
