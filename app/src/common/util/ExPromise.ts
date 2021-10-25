export interface CancellablePromise<T, R = undefined> extends Promise<T> {
    cancel(reason: R): void;
}
export class PromiseCancelledError<R> extends Error {
    constructor(public reason: R, message?: string) {
        super(message ?? `process cancelled (reason: ${reason})`);
    }
}

export interface ProgressPromise<T, P = undefined> extends Promise<T>, EventTarget {
    currentProgress: P | undefined;
    onprogress: ((event: PromiseProgressEvent<P>) => void) | null;
}
export class PromiseProgressEvent<P> extends Event {
    constructor(public progress: P) {
        super('progress');
    }
}

export interface CachedPromise<T> extends Promise<T> {
    cachedValue: PromiseLike<T>;
}

export class ExPromise<T, R, P>
    extends EventTarget
    implements Promise<T>, CancellablePromise<T, R>, ProgressPromise<T, P>, CachedPromise<T>
{
    private innerPromise: Promise<T>;
    private cancellation: { isCancelled: false } | { isCancelled: true; reason: R } = { isCancelled: false };

    onprogress: ((event: PromiseProgressEvent<P>) => void) | null = null;
    cachedValue: PromiseLike<T>;
    currentProgress: P | undefined;

    constructor(
        f: (
            resolve: (value: T) => void,
            reject: (reason: any) => void,
            resolveCache: (value: T | PromiseLike<T>) => void,
            checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
            reportProgress: (progress: P) => void
        ) => void
    ) {
        super();

        let resolveCache: (value: T | PromiseLike<T>) => void | undefined;
        this.cachedValue = new Promise((resolve) => {
            resolveCache = resolve;
        });

        const checkCancelled = (handler: ((reason: R) => boolean) | undefined) => {
            if (this.cancellation.isCancelled) {
                if (!handler?.(this.cancellation.reason)) {
                    throw new PromiseCancelledError(this.cancellation.reason);
                }
            }
        };
        const reportProgress = (progress: P) => {
            this.currentProgress = progress;
            this.dispatchEvent(new PromiseProgressEvent(progress));
        };

        this.innerPromise = new Promise((resolve, reject) => {
            f(resolve, reject, resolveCache, checkCancelled, reportProgress);
        });
    }
    [Symbol.toStringTag]: string;

    cancel(reason: R): void {
        this.cancellation = { isCancelled: true, reason };
    }
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2> {
        return this.innerPromise.then(onfulfilled, onrejected);
    }
    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult> {
        return this.innerPromise.catch(onrejected);
    }
    finally(onfinally?: (() => void) | undefined | null): Promise<T> {
        return this.innerPromise.finally(onfinally);
    }
}

export function createCancellableProgressCachedPromise<T, R, P>(
    f: (
        resolveCache: (value: T | PromiseLike<T>) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
        reportProgress: (progress: P) => void
    ) => Promise<T> | T
): CancellablePromise<T, R> & ProgressPromise<T, P> & CachedPromise<T> {
    return new ExPromise(async (resolve, reject, resolveCache, checkCancelled, reportProgress) => {
        try {
            resolve(await f(resolveCache, checkCancelled, reportProgress));
        } catch (e) {
            reject(e);
        }
    });
}
export function createCancellableProgressPromise<T, R, P>(
    f: (
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
        reportProgress: (progress: P) => void
    ) => Promise<T> | T
): CancellablePromise<T, R> & ProgressPromise<T, P> {
    return new ExPromise(async (resolve, reject, _resolveCache, checkCancelled, reportProgress) => {
        try {
            resolve(await f(checkCancelled, reportProgress));
        } catch (e) {
            reject(e);
        }
    });
}
export function createCancellableCachedPromise<T, R>(
    f: (
        resolveCache: (value: T | PromiseLike<T>) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void
    ) => Promise<T> | T
): CancellablePromise<T, R> & CachedPromise<T> {
    return new ExPromise(async (resolve, reject, resolveCache, checkCancelled) => {
        try {
            resolve(await f(resolveCache, checkCancelled));
        } catch (e) {
            reject(e);
        }
    });
}
export function createProgressCachedPromise<T, P>(
    f: (resolveCache: (value: T | PromiseLike<T>) => void, reportProgress: (progress: P) => void) => Promise<T> | T
): ProgressPromise<T, P> & CachedPromise<T> {
    return new ExPromise(async (resolve, reject, resolveCache, _checkCancelled, reportProgress) => {
        try {
            resolve(await f(resolveCache, reportProgress));
        } catch (e) {
            reject(e);
        }
    });
}
export function createCancellablePromise<T, R>(
    f: (checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void) => Promise<T> | T
): CancellablePromise<T, R> {
    return new ExPromise(async (resolve, reject, _resolveCache, checkCancelled) => {
        try {
            resolve(await f(checkCancelled));
        } catch (e) {
            reject(e);
        }
    });
}
export function createProgressPromise<T, P>(
    f: (reportProgress: (progress: P) => void) => Promise<T> | T
): ProgressPromise<T, P> {
    return new ExPromise(async (resolve, reject, _resolveCache, _checkCancelled, reportProgress) => {
        try {
            resolve(await f(reportProgress));
        } catch (e) {
            reject(e);
        }
    });
}
export function createCachedPromise<T>(
    f: (resolveCache: (value: T | PromiseLike<T>) => void) => Promise<T> | T
): CachedPromise<T> {
    return new ExPromise(async (resolve, reject, resolveCache) => {
        try {
            resolve(await f(resolveCache));
        } catch (e) {
            reject(e);
        }
    });
}
export function pipeProgress<T, P>(
    reportProgress: (progress: P) => void,
    promise: ProgressPromise<T, P>
): ProgressPromise<T, P> {
    promise.addEventListener('progress', (event) => {
        reportProgress((event as PromiseProgressEvent<P>).progress);
    });
    return promise;
}
