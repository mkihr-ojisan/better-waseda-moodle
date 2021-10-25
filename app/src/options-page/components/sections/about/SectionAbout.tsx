import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import React, { ReactElement } from 'react';
import Link from '../../options/Link';

const useStyles = makeStyles(() => ({
    center: {
        textAlign: 'center',
    },
    notCenter: {
        textAlign: 'initial',
    },
}));

export default {
    name: 'SectionAbout',
    title: 'optionsAboutTitle',
    Icon: InfoIcon,
    divider: true,
    Component: function SectionAbout(): ReactElement {
        const classes = useStyles();

        return (
            <div className={classes.center}>
                <Box py={3}>
                    <img src="/res/images/icon.svg" width="128" />
                </Box>
                <Box pb={3}>
                    <Typography variant="h6">{browser.i18n.getMessage('appName')}</Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                        {browser.i18n.getMessage('version', browser.runtime.getManifest().version)}
                    </Typography>
                </Box>
                <Box pb={3} px={3}>
                    <Typography variant="body2" color="textSecondary" component="div" className={classes.notCenter}>
                        {browser.i18n.getMessage('optionsAboutDisclaimer')}
                    </Typography>
                </Box>
                <Box pb={3}>
                    <List>
                        <Divider />
                        <Link
                            message="optionsAboutSourceCode"
                            href="https://github.com/mkihr-ojisan/better-waseda-moodle"
                        />
                        <Divider />
                    </List>
                </Box>
            </div>
        );
    },
};
