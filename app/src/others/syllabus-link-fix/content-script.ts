document.oncontextmenu = null;

document.querySelectorAll('.ctable-main td:nth-child(3) > a').forEach(_elem => {
    const elem = _elem as HTMLAnchorElement;

    const [, key] = elem.getAttribute('onclick')?.match(/^post_submit\('[^']+', '([^']+)'\)$/) ?? [];
    if (!key) return;

    elem.href = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}`;
    elem.removeAttribute('onclick');
});