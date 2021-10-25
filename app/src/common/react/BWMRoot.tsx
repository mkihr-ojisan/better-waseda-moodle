import CssBaseline from '@mui/material/CssBaseline';
import React, { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getCurrentContextType } from '../util/util';
import BWMThemeDarkReader from './theme/BWMThemeDarkReader';
import BWMThemePrefersColorScheme from './theme/BWMThemePrefersColorScheme';

export default React.memo(function BWMRoot(props) {
    const currentContextType = getCurrentContextType();
    const ThemeProvider = currentContextType === 'content_script' ? BWMThemeDarkReader : BWMThemePrefersColorScheme;

    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ThemeProvider>
                    {currentContextType === 'extension_page' && <CssBaseline />}
                    {props.children}
                </ThemeProvider>
            </ErrorBoundary>
        </StrictMode>
    );
});

function ErrorFallback({ error }: { error: Error }) {
    return <>🥴{browser.i18n.getMessage('otherError', error.message)}</>;
}
