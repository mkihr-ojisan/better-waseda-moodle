/* eslint-disable */
(() => {
    // XMLHttpRequestをいじって特定のURLに対して特定のレスポンスを返すようにする

    let blockedRequests;
    switch (location.href) {
        case "https://wsdmoodle.waseda.jp/my/":
            // ダッシュボードのコース概要を取得するリクエストをブロックして高速化
            blockedRequests = [
                {
                    condition: "info=core_course_get_enrolled_courses_by_timeline_classification",
                    response: JSON.stringify([{ error: false, data: { courses: [], nextoffset: 0 } }]),
                },
                {
                    condition: "info=local_liquidus_event_definition",
                    response: JSON.stringify([
                        {
                            error: false,
                            data: [
                                { provider: "appcues", definition: [] },
                                { provider: "google", definition: [] },
                                { provider: "keenio", definition: [] },
                                { provider: "kinesis", definition: [] },
                                { provider: "mixpanel", definition: [] },
                                { provider: "segment", definition: [] },
                            ],
                        },
                    ]),
                },
            ];
            break;
        default:
            return;
    }

    const _XMLHttpRequest_responseText = Object.getOwnPropertyDescriptor(
        window.XMLHttpRequest.prototype,
        "responseText"
    ).get;
    const _XMLHttpRequest_open = window.XMLHttpRequest.prototype.open;
    const _XMLHttpRequest_send = window.XMLHttpRequest.prototype.send;
    const _XMLHttpRequest_setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;

    Object.defineProperties(window.XMLHttpRequest.prototype, {
        responseText: {
            get: function () {
                if (this._blocked) {
                    return this._response;
                } else {
                    return _XMLHttpRequest_responseText.call(this);
                }
            },
        },
        open: {
            value: function (method, url, async, username, password) {
                const block = blockedRequests.find((block) => url.includes(block.condition));
                if (block) {
                    this._blocked = true;
                    this._response = block.response;
                } else {
                    _XMLHttpRequest_open.call(this, method, url, async, username, password);
                }
            },
        },
        send: {
            value: function (body) {
                if (this._blocked) {
                    this.onload?.();
                } else {
                    _XMLHttpRequest_send.call(this, body);
                }
            },
        },
        setRequestHeader: {
            value: function (name, value) {
                if (!this._blocked) {
                    _XMLHttpRequest_setRequestHeader.call(this, name, value);
                }
            },
        },
    });
})();
