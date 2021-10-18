import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Signal, useHandleSignal } from '../../common/react/signal';
import { OptionsPageSection } from './OptionsPage';

type Props = {
    section: OptionsPageSection;
    scrollOffset: number;
    scrollSignal: Signal<number>;
    selectedSectionIndex: number;
    index: number;
    onScrolledTo: () => void;
};

const useStyles = makeStyles(() => ({
    grid: {
        '&:last-child > .MuiPaper-root': {
            marginBottom: 'calc(100vh - 100% - 30px)',
        },
    },
}));

export default React.memo(function OptionsPageSectionContent(props: Props) {
    const classes = useStyles();
    const elem = useRef<HTMLDivElement | null>(null);

    useHandleSignal(
        props.scrollSignal,
        useCallback(
            (value) => {
                if (elem.current && props.index === value) {
                    document.documentElement.scrollTo({
                        top: elem.current.offsetTop - props.scrollOffset,
                    });
                }
            },
            [props.index, props.scrollOffset]
        )
    );

    useEffect(() => {
        const listener = () => {
            if (elem.current && props.selectedSectionIndex !== props.index) {
                const scroll = window.scrollY + props.scrollOffset - elem.current.offsetTop;
                const isScrolledToSection = (0 <= scroll || props.index === 0) && scroll < elem.current.offsetHeight;
                if (isScrolledToSection) props.onScrolledTo();
            }
        };
        document.addEventListener('scroll', listener);
        return () => {
            document.removeEventListener('scroll', listener);
        };
    });

    return (
        <Grid ref={elem} item className={classes.grid}>
            <Typography variant="h6">{browser.i18n.getMessage(props.section.title)}</Typography>
            <Paper>
                <props.section.Component />
            </Paper>
        </Grid>
    );
});
