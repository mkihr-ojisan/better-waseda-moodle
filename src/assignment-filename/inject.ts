import format from "string-format";

(() => {
    const File_prototype_name = Object.getOwnPropertyDescriptor(File.prototype, "name")!.get!;

    // ファイル名の形式
    let template = "{filename}{extension}";
    // formatに渡す引数
    let formatArgs: Record<string, string> = {};

    /**
     * 変更されたファイル名を取得する
     *
     * @param file - ファイル
     * @returns 変更されたファイル名
     */
    const getFilename = (file: File) => {
        const originalFilename: string = File_prototype_name.call(file);

        // ピリオドを含む拡張子
        let extension;
        // 拡張子を除いたファイル名
        let filename;
        if (originalFilename.includes(".")) {
            extension = "." + originalFilename.split(".").pop();
            filename = originalFilename.slice(0, -extension.length);
        } else {
            extension = "";
            filename = originalFilename;
        }

        return format(template, {
            ...formatArgs,
            filename,
            extension,
        });
    };

    // ファイルがドラッグアンドドロップされたときに、ファイル名を変更する
    Object.defineProperties(File.prototype, {
        name: {
            get() {
                return getFilename(this);
            },
        },
    });

    // コンテンツスクリプトからtemplateとformatArgsを受け取る
    window.addEventListener("message", (event) => {
        if (typeof event.data === "object" && "assignment-filename-template" in event.data) {
            template = event.data["assignment-filename-template"];
        }
        if (typeof event.data === "object" && "assignment-filename-format-args" in event.data) {
            formatArgs = event.data["assignment-filename-format-args"];
        }
    });

    // ファイル選択ダイアログでファイルが選択されたときに、ファイル名を変更する
    document.addEventListener("change", (event) => {
        if (event.target instanceof HTMLInputElement && event.target.name === "repo_upload_file") {
            const titleField = event.target.form?.querySelector("input[name=title]") as HTMLInputElement | null;
            if (titleField) {
                titleField.value = getFilename(event.target.files![0]);
            }
        }
    });
})();
