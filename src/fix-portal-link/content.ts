const script = document.createElement("script");
script.src = browser.runtime.getURL("/fix-portal-link/inject.js");
document.head.appendChild(script);
