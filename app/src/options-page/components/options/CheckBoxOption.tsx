import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import { ConfigKeyWithType } from '../../../common/config/config';
import CustomizedReactMarkdown from '../../../common/react/CustomizedReactMarkdown';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';

type Props = {
    configKey: ConfigKeyWithType<boolean>;
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
