import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
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
        <ListItem button onClick={handleClick} disabled={disabled} classes={{ root: classes.listItemRoot }}>
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
            <ListItemSecondaryAction>
                <Switch checked={value} onClick={handleClick} disabled={disabled} />
            </ListItemSecondaryAction>
        </ListItem>
    );
});
