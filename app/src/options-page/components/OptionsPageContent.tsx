import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useRef } from 'react';
import { Signal } from '../../common/react/signal';
import { OPTIONS_PAGE_SECTIONS } from './OptionsPage';
import OptionsPageSectionContent from './OptionsPageSectionContent';

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        paddingBlock: theme.spacing(3),
    },
}));

type Props = {
    selectedSectionIndex: number;
    onScrolledToSection: (index: number) => void;
    scrollSignal: Signal<number>;
};

export default React.memo(function OptionsPageContent(props: Props) {
    const classes = useStyles();
    const headerMarginRef = useRef<HTMLDivElement | null>(null);

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} ref={headerMarginRef} />
            <Container maxWidth="sm">
                <Grid container spacing={3} direction="column">
                    {OPTIONS_PAGE_SECTIONS.map((section, i) => (
                        <OptionsPageSectionContent
                            key={section.title}
                            section={section}
                            scrollOffset={headerMarginRef.current?.offsetHeight ?? 0}
                            scrollSignal={props.scrollSignal}
                            index={i}
                            selectedSectionIndex={props.selectedSectionIndex}
                            onScrolledTo={() => props.onScrolledToSection(i)}
                        />
                    ))}
                </Grid>
            </Container>
        </main>
    );
});
