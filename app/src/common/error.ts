export class BWMError extends Error {
    innerError?: unknown;

    constructor(message: string, innerError?: unknown) {
        let innerErrorMessage;
        if (!innerError) {
            innerErrorMessage = '';
        } else if (innerError instanceof BWMError) {
            innerErrorMessage = innerError.message;
        } else if (innerError instanceof Error) {
            innerErrorMessage = `${browser.i18n.getMessage('unknownError')} (${innerError.message})`;
        } else {
            innerErrorMessage = String(innerError);
        }
        super(message + (innerErrorMessage ? ': ' + innerErrorMessage : ''));
        this.innerError = innerError;
    }
}

export class TimetableConflictError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('timetableConflictError'), innerError);
    }
}

export class InvalidResponseError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('invalidResponseError'), innerError);
    }
}

export class FetchCourseListError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('fetchCourseListError'), innerError);
    }
}

export class LoginRequiredError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('loginRequiredError'), innerError);
    }
}

export class FetchCourseRegistrationInfoError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('fetchCourseRegistrationInfoError'), innerError);
    }
}

export class CourseRegistrationPageUnderMaintenance extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('courseRegistrationPageUnderMaintenance'), innerError);
    }
}

export class FetchActionEventsByTimeSortError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('fetchActionEventsByTimeSortError'), innerError);
    }
}

export class LoginError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('loginError'), innerError);
    }
}

export class FetchCourseContentError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('fetchCourseContentError'), innerError);
    }
}

export class FetchCalendarEventByIdError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage('fetchCalendarEventByIdError'), innerError);
    }
}
