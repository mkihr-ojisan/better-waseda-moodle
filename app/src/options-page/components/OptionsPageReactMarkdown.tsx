import { makeStyles } from '@material-ui/core/styles';
import React, { HTMLAttributes, ReactElement } from 'react';
import { useCallback } from 'react';
import ReactMarkdown, { ReactMarkdownOptions } from 'react-markdown';

export default function OptionsPageReactMarkdown(props: ReactMarkdownOptions): ReactElement {
    return <ReactMarkdown {...props} components={{ a: A, p: P }} />;
}

const useStyles = makeStyles((theme) => ({
    p: {
        color: theme.palette.text.secondary,
    },
}));

function A(props: HTMLAttributes<HTMLAnchorElement>) {
    const handleEvent = useCallback((event: React.SyntheticEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
    }, []);

    return <a {...props} onClick={handleEvent} onTouchStart={handleEvent} target="_blank" />;
}

function P(props: HTMLAttributes<HTMLParagraphElement>) {
    const classes = useStyles();

    const newProps = {
        ...props,
        className: props.className + ' ' + classes.p,
    };

    return <p {...newProps} />;
}
