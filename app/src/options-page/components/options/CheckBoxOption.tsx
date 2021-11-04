import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import CustomizedReactMarkdown from '../OptionsPageReactMarkdown';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';
import { ConfigKey } from '../../../common/config/config';

type Props = {
    configKey: ConfigKey;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    useMarkdownForDescription?: boolean;
    dense?: boolean;
};

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 70,
    },
}));

export default React.memo(function ToggleOption(props: Props) {
    const [value, setValue] = useConfig(props.configKey);
    if (typeof value !== 'boolean') throw Error('`value` must be boolean.');

    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    const handleClick = useCallback(() => {
        setValue(!value);
    }, [setValue, value]);

    return (
        <ListItem
            button
            onClick={handleClick}
            disabled={disabled}
            classes={{ root: classes.listItemRoot }}
            dense={props.dense}
        >
            <ListItemIcon>
                <Checkbox edge="start" checked={value} onClick={handleClick} disabled={disabled} />
            </ListItemIcon>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description &&
                    (props.useMarkdownForDescription ? (
                        <CustomizedReactMarkdown>
                            {props.description &&
                                browser.i18n.getMessage(props.description, props.descriptionSubstitutions)}
                        </CustomizedReactMarkdown>
                    ) : (
                        props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                    ))
                }
            />
        </ListItem>
    );
});
