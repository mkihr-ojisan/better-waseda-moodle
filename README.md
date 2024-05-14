# Better Waseda Moodle

<img src="https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/main/src/res/images/icon.svg" alt="Better Waseda Moodle" width="128">

Waseda Moodle の使い勝手を多少良くするブラウザ拡張機能。

## インストール

-   [Firefox](https://github.com/mkihr-ojisan/better-waseda-moodle/releases/download/v0.8.1/better-waseda-moodle.v0.8.1.firefox.xpi)
-   [Chrome](https://chrome.google.com/webstore/detail/better-waseda-moodle/omijfabnmlifcmmghegpbmoieibfbmmj)

## 主な機能

-   自動ログイン
-   Moodle トップページに時間割表を表示
-   ツールバーのアイコンをクリックすると課題一覧を表示
-   スタイルの修正

すべての機能を見るには、拡張機能をインストールして設定ページを開いてください。

## スクリーンショット

![ダッシュボード](https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/main/readme-images/dashboard.png "ダッシュボード")

## ビルド
### 要件
-  Node.js (v19.2.0)

```console
$ npm install
$ npm run build $VENDOR # "firefox" or "chrome"
$ ls packages/better-waseda-moodle.*.zip
```

### 使用ツール

-   [webextension-toolbox](https://github.com/webextension-toolbox/webextension-toolbox)
