export interface CancellablePromise<T, R = undefined> extends Promise<T> {
    cancel(reason: R): void;
}
export class PromiseCancelledError<R> extends Error {
    constructor(public reason: R, message?: string) {
        super(message ?? `process cancelled (reason: ${reason})`);
    }
}

export interface ProgressPromise<T, P = undefined> extends Promise<T>, EventTarget {
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

    constructor(
        f: (
            resolve: (value: T) => void,
            reject: (reason: any) => void,
            resolveCache: (value: T) => void,
            checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
            reportProgress: (progress: P) => void
        ) => void
    ) {
        super();

        let resolveCache: (value: T) => void | undefined;
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
        resolve: (value: T) => void,
        reject: (reason: any) => void,
        resolveCache: (value: T) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
        reportProgress: (progress: P) => void
    ) => void
): CancellablePromise<T, R> & ProgressPromise<T, P> & CachedPromise<T> {
    return new ExPromise(f);
}
export function createCancellableProgressPromise<T, R, P>(
    f: (
        resolve: (value: T) => void,
        reject: (reason: any) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void,
        reportProgress: (progress: P) => void
    ) => void
): CancellablePromise<T, R> & ProgressPromise<T, P> {
    return new ExPromise((resolve, reject, _resolveCache, checkCancelled, reportProgress) =>
        f(resolve, reject, checkCancelled, reportProgress)
    );
}
export function createCancellableCachedPromise<T, R>(
    f: (
        resolve: (value: T) => void,
        reject: (reason: any) => void,
        resolveCache: (value: T) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void
    ) => void
): CancellablePromise<T, R> & CachedPromise<T> {
    return new ExPromise((resolve, reject, resolveCache, checkCancelled) =>
        f(resolve, reject, resolveCache, checkCancelled)
    );
}
export function createProgressCachedPromise<T, P>(
    f: (
        resolve: (value: T) => void,
        reject: (reason: any) => void,
        resolveCache: (value: T) => void,
        reportProgress: (progress: P) => void
    ) => void
): ProgressPromise<T, P> & CachedPromise<T> {
    return new ExPromise((resolve, reject, resolveCache, _checkCancelled, reportProgress) =>
        f(resolve, reject, resolveCache, reportProgress)
    );
}
export function createCancellablePromise<T, R>(
    f: (
        resolve: (value: T) => void,
        reject: (reason: any) => void,
        checkCancelled: (handler: ((reason: R) => boolean) | undefined) => void
    ) => void
): CancellablePromise<T, R> {
    return new ExPromise((resolve, reject, _resolveCache, checkCancelled) => f(resolve, reject, checkCancelled));
}
export function createProgressPromise<T, P>(
    f: (resolve: (value: T) => void, reject: (reason: any) => void, reportProgress: (progress: P) => void) => void
): ProgressPromise<T, P> {
    return new ExPromise((resolve, reject, _resolveCache, _checkCancelled, reportProgress) =>
        f(resolve, reject, reportProgress)
    );
}
export function createCachedPromise<T>(
    f: (resolve: (value: T) => void, reject: (reason: any) => void, resolveCache: (value: T) => void) => void
): CachedPromise<T> {
    return new ExPromise((resolve, reject, resolveCache) => f(resolve, reject, resolveCache));
}
