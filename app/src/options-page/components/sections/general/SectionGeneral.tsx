import React, { ReactElement } from 'react';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionConfigSync from './OptionConfigSync';

export default function SectionGeneral(props: SectionComponentProps): ReactElement | null {
    return (
        <Section titleMessageName="optionsSectionGeneral" {...props}>
            <OptionConfigSync />
        </Section>
    );
}
