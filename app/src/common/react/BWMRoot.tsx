import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getCurrentContextType } from '../util/util';
import BWMThemeDarkReader from './theme/BWMThemeDarkReader';
import BWMThemePrefersColorScheme from './theme/BWMThemePrefersColorScheme';

export default React.memo(function BWMRoot(props) {
    const ThemeProvider =
        getCurrentContextType() === 'content_script' ? BWMThemeDarkReader : BWMThemePrefersColorScheme;

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeProvider>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </ErrorBoundary>
    );
});

function ErrorFallback({ error }: { error: Error }) {
    return <>🥴{browser.i18n.getMessage('otherError', error.message)}</>;
}
