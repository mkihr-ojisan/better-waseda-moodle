export class InternalError extends Error {
    constructor(message?: string) {
        super(browser.i18n.getMessage('internalError') + (message ? ': ' + message : ''));
    }
}

export class LoginRequiredError extends Error {
    constructor() {
        super(browser.i18n.getMessage('loginRequiredError'));
    }
}

export class InvalidResponseError extends Error {
    constructor(description?: string) {
        super(browser.i18n.getMessage('invalidResponseError') + (description ? ': ' + description : ''));
    }
}

export class UserIdOrPasswordNotSetError extends Error {
    constructor() {
        super(browser.i18n.getMessage('userIdOrPasswordNotSetError'));
    }
}

export class UnderMaintenanceError extends Error {
    constructor() {
        super(browser.i18n.getMessage('underMaintenanceError'));
    }
}

export class TimetableConflictError extends Error {
    constructor() {
        super(browser.i18n.getMessage('timetableConflictError'));
    }
}
