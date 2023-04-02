window.addEventListener("DOMContentLoaded", () => {
    // コンテンツスクリプトの環境はページの環境から隔離されているため、scriptタグで読み込ませることでinject.jsをページの環境で実行する
    // https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E7%92%B0%E5%A2%83
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("/block-xhr-requests/inject.js");
    document.head.appendChild(script);
});
