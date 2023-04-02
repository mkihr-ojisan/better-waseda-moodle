export class EventDispatcher<Events extends string, EventData extends Record<Events, unknown>> {
    private listeners: Partial<Record<Events, ((data: EventData[Events]) => void)[]>> = {};

    on(event: Events, listener: (data: EventData[Events]) => void, cancelSignal?: AbortSignal): void {
        if (cancelSignal && cancelSignal.aborted) {
            return;
        }

        const listeners = this.listeners[event];
        if (listeners) {
            listeners.push(listener);
        } else {
            this.listeners[event] = [listener];
        }

        if (cancelSignal) {
            cancelSignal.addEventListener("abort", () => this.off(event, listener));
        }
    }

    off(event: Events, listener: (data: EventData[Events]) => void): void {
        const listeners = this.listeners[event];
        if (listeners) {
            this.listeners[event] = listeners.filter((l) => l !== listener);
        }
    }

    protected dispatch(event: Events, data: EventData[Events]): void {
        const listeners = this.listeners[event];
        if (listeners) {
            listeners.forEach((listener) => listener(data));
        }
    }
}
