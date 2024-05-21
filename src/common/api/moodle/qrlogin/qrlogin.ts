import { fetchHTML } from "@/common/util/fetch";
import { MoodleSuccessResponse, callMoodleAPI } from "../moodle";

/**
 * プロファイルページのQRコードからトークンを取得する
 */
export async function getWebServiceTokenFromQRCode(): Promise<string> {
    const userProfilePage = await fetchHTML("https://wsdmoodle.waseda.jp/user/profile.php");
    const qrCodeImageElem = userProfilePage.getElementById("qrcode")?.getElementsByTagName("img")[0];
    if (!qrCodeImageElem) throw new Error("QR code image not found");
    const qrCodeImage = qrCodeImageElem.getAttribute("src");
    if (!qrCodeImage) throw new Error("QR code image not found");

    await chrome.offscreen.createDocument({
        url: chrome.runtime.getURL("common/api/moodle/qrlogin/qr-scanner.html"),
        justification: "QR code scanner",
        reasons: [chrome.offscreen.Reason.BLOBS],
    });

    const result: { data: string } | { error: string } = await chrome.runtime.sendMessage({
        type: "qr-scanner",
        image: qrCodeImage,
    });

    await chrome.offscreen.closeDocument();

    if ("error" in result) {
        throw new Error(result.error);
    }

    // ltgopenlmsapp://https://wsdmoodle.waseda.jp?qrlogin=...&userid=...
    const loginUrl = new URL(result.data);
    const qrloginkey = loginUrl.searchParams.get("qrlogin");
    if (!qrloginkey) throw new Error("QR login token not found");
    const userid = loginUrl.searchParams.get("userid");
    if (!userid) throw new Error("User ID not found");

    const response: MoodleSuccessResponse<{ token: string }> = await callMoodleAPI([
        {
            methodname: "tool_mobile_get_tokens_for_qr_login",
            args: { qrloginkey, userid },
        },
    ]);

    return response[0].data.token;
}
