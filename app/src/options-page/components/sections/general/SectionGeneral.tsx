import Grid from '@material-ui/core/Grid';
import React, { ReactElement } from 'react';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionBackupConfig from './OptionBackupConfig';
import OptionConfigSync from './OptionConfigSync';
import OptionRestoreConfig from './OptionRestoreConfig';

export default React.memo(function SectionGeneral(props: SectionComponentProps): ReactElement | null {
    return (
        <Section titleMessageName="optionsSectionGeneral" {...props}>
            <OptionConfigSync />

            <Grid container spacing={1}>
                <Grid item>
                    <OptionBackupConfig />
                </Grid>
                <Grid item>
                    <OptionRestoreConfig />
                </Grid>
            </Grid>
        </Section>
    );
});
