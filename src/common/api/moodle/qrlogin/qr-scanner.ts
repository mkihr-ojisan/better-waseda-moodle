import QrScanner from "qr-scanner";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "qr-scanner") return;

    // { type: "qr-scanner", image: "data:image/png;base64,..." } を受け取って
    // { data: "..." } または { error: "..." } を返す

    (async () => {
        try {
            const imageUri = message.image;
            if (!imageUri) {
                throw new Error("No image provided");
            }

            // 透過PNGだと読み取れないので背景を白くする
            const image = new Image();
            image.src = imageUri;
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });

            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const context = canvas.getContext("2d")!;
            context.fillStyle = "rgb(255, 255, 255)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);

            const result = await QrScanner.scanImage(canvas, { returnDetailedScanResult: true });
            sendResponse({ data: result.data });
        } catch (e) {
            sendResponse({ error: String(e) });
        }
    })();
    return true;
});
