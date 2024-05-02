(() => {
    const _addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (this === window && type === "unload") {
            // windowのunloadイベントを無視する
            return;
        } else {
            return _addEventListener.call(this, type, listener, options);
        }
    };
})();
