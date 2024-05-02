import { PluralRules } from "@/common/util/intl";

let stylesInserted = false;
/**
 * 必要なスタイルを挿入する
 */
function insertStyles() {
    if (stylesInserted) return;

    const style = `
.bwm-word-counter {
    color: #888;
    text-align: right;
}
.bwm-word-counter span {
    cursor: pointer;
}
`;
    const styleElem = document.createElement("style");
    styleElem.textContent = style;
    document.head.appendChild(styleElem);

    stylesInserted = true;
}

/**
 * 単語数をカウントする
 *
 * @param text - テキスト
 * @returns 単語数
 */
function countWords(text: string): number {
    const trimmed = text.replace(/\s+/g, " ").trim();
    if (trimmed.length === 0) {
        return 0;
    } else {
        return trimmed.split(" ").length;
    }
}

/**
 * 文字数をカウントする
 *
 * @param text - テキスト
 * @returns 文字数
 */
function countChars(text: string): number {
    return text.replace(/\s/g, "").length;
}

let countType: "word" | "char" | undefined;

/**
 * 文字数をカウントするか、単語数をカウントするかを判定する
 *
 * @param text - テキスト
 * @returns 文字数をカウントするか、単語数をカウントするか
 */
function getCountType(text: string): "word" | "char" {
    if (countType) return countType;
    // 8割以上がASCII文字なら単語数をカウントする
    if (text.trim().length > 0 && text.split("").filter((c) => c.charCodeAt(0) < 128).length / text.length > 0.8) {
        return "word";
    } else {
        return "char";
    }
}

const pluralRules = new PluralRules();

/**
 * 文字数または単語数をカウントして表示する
 *
 * @param text - テキスト
 * @returns 表示する文字列
 */
function count(text: string): string {
    if (getCountType(text) === "word") {
        const words = countWords(text);
        return browser.i18n.getMessage(`word_counter_word_count_${pluralRules.select(words)}`, words.toString());
    } else {
        const chars = countChars(text);
        return browser.i18n.getMessage(`word_counter_char_count_${pluralRules.select(chars)}`, chars.toString());
    }
}

/**
 * 指定したエディタに対して、文字数カウンターを初期化する
 *
 * @param editorElem - エディタの要素
 */
function initCounter(editorElem: HTMLElement) {
    if (editorElem.getAttribute("data-bwm-word-counter")) {
        return;
    }

    insertStyles();

    editorElem.setAttribute("data-bwm-word-counter", "");

    const counterWrapper = document.createElement("div");
    counterWrapper.classList.add("bwm-word-counter");
    const counter = document.createElement("span");
    counterWrapper.appendChild(counter);
    editorElem.appendChild(counterWrapper);

    const contentElem = editorElem.getElementsByClassName("editor_atto_content")[0] as HTMLElement | null;
    if (!contentElem) return;

    const updateCount = () => {
        let newCount;

        const selection = window.getSelection();
        if (
            selection &&
            contentElem.contains(selection.anchorNode) &&
            contentElem.contains(selection.focusNode) &&
            selection.toString().length > 0
        ) {
            newCount = browser.i18n.getMessage(
                "word_counter_selection",
                count(window.getSelection()?.toString() ?? "")
            );
        } else {
            newCount = count(contentElem.innerText);
        }

        if (counter.textContent !== newCount) {
            counter.textContent = newCount;
        }
    };

    new MutationObserver(() => {
        updateCount();
    }).observe(contentElem, { childList: true, subtree: true, characterData: true });

    document.addEventListener("selectionchange", () => {
        updateCount();
    });

    counter.addEventListener("click", () => {
        switch (getCountType(contentElem.innerText)) {
            case "word":
                countType = "char";
                break;
            case "char":
                countType = "word";
                break;
        }
        updateCount();
    });

    counter.title = browser.i18n.getMessage("word_counter_tooltip");
}

// editor_atto_wrapの要素が追加されたら文字数カウンターを初期化する
const observer = new MutationObserver((records) => {
    for (const record of records) {
        if (record.target instanceof HTMLElement && record.target.classList.contains("editor_atto_wrap")) {
            initCounter(record.target);
        }
    }
});
observer.observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: true });
