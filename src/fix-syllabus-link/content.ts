(() => {
    const elem = document.createElement("script");
    elem.src = browser.runtime.getURL("fix-syllabus-link/inject.js");
    document.head.appendChild(elem);
})();
