document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("/faster-back-and-forward/inject.js");
    document.head.appendChild(script);
});
