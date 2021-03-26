import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
    expanded: boolean;
    onChange: (_: React.ChangeEvent<{}>, newExpanded: boolean) => void;
    children: ReactNode;
    titleMessageName: string;
};


export default function Section(props: Props): ReactElement {
    return (
        <Accordion expanded={props.expanded} onChange={props.onChange}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                    {browser.i18n.getMessage(props.titleMessageName)}
                </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
                {props.children}
            </AccordionDetails>
        </Accordion>
    );
}