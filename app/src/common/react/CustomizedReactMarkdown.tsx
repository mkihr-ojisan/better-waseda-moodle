import React, { AnchorHTMLAttributes, ReactElement } from 'react';
import { useCallback } from 'react';
import ReactMarkdown, { ReactMarkdownOptions } from 'react-markdown';

export default function CustomizedReactMarkdown(props: ReactMarkdownOptions): ReactElement {
    return <ReactMarkdown {...props} components={{ a: A }} />;
}

function A(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const handleEvent = useCallback((event: React.SyntheticEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
    }, []);

    return <a {...props} onClick={handleEvent} onTouchStart={handleEvent} target="_blank" />;
}
