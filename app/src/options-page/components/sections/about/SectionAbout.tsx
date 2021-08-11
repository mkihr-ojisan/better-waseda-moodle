import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import React, { ReactElement } from 'react';
import Link from '../../options/Link';

const useStyles = makeStyles(() => ({
    center: {
        textAlign: 'center',
    },
    notCenter: {
        textAlign: 'initial',
        textIndent: '1em',
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
                    <img src="/res/images/icon-256.png" width="128" />
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
