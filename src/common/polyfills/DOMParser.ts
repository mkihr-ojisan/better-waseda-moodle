import { DOMParser as _DOMParser } from "xmldom";

// Service WorkerにはDOMParserがないので、xmldomで代用する
globalThis.DOMParser = class DOMParser extends _DOMParser {
    constructor() {
        super({
            errorHandler: {
                warning: () => {
                    // do nothing
                },
                error: () => {
                    // do nothing
                },
                fatalError: () => {
                    // do nothing
                },
            },
        });
    }
};

const document = new DOMParser().parseFromString("<html></html>", "text/html");
const elem = document.createElement("div");
const Element_prototype = Object.getPrototypeOf(elem);

Object.defineProperty(Element_prototype, "nextElementSibling", {
    get() {
        let node = this.nextSibling;
        while (node && node.nodeType !== 1) {
            node = node.nextSibling;
        }
        return node;
    },
});
