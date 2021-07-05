# Better Waseda Moodle

<img src="https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/develop/app/res/images/icon-256.png" alt="Better Waseda Moodle" width="128">

Waseda Moodleの使い勝手を多少良くするブラウザ拡張機能。

## 機能
- 自動ログイン
- [この動画](https://wcms.waseda.jp/settings/viewer/uniplayer/intro.mp4?)を削除
- Moodleトップページのコース概要を改善
    - 表示を高速化
    - 時間割表
    - シラバスを開く
    - 課題一覧
- PDF、画像ファイル等をブラウザで直接開けるようにする
- 課題提出ページの「レポート・論文等の提出に関する注意」に自動でチェックを入れる
- 小テストの残り時間を見やすくする
- 小テストで未回答の問題があるときに警告
- シラバス検索結果のリンクを修正する
- 設定の同期

## スクリーンショット
![自動ログイン](https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/develop/readme-images/auto-login.png "自動ログイン")
![コース概要](https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/develop/readme-images/course-overview.png "コース概要")
![コース概要のメニュー](https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/develop/readme-images/course-overview-menu.png "コース概要のメニュー")

## インストール

- [Firefox](https://github.com/mkihr-ojisan/better-waseda-moodle/releases/download/v0.4.0/better-waseda-moodle-v0.4.0-firefox.xpi)
- [Chrome](https://chrome.google.com/webstore/detail/better-waseda-moodle/omijfabnmlifcmmghegpbmoieibfbmmj)

## ビルド
```console
$ git clone https://github.com/mkihr-ojisan/better-waseda-moodle
$ cd better-waseda-moodle
$ npm install
$ npm run build $YOUR_BROWSER # "firefox", "chrome", "opera" or "edge" 
$ ls packages
```

## 開発

```console
$ git clone https://github.com/mkihr-ojisan/better-waseda-moodle
$ cd better-waseda-moodle
$ npm install
$ npm run dev $YOUR_BROWSER # "firefox", "chrome", "opera" or "edge" 
$ ls dist/$YOUR_BROWSER
```

### 使用ツール
- [webextension-toolbox](https://github.com/webextension-toolbox/webextension-toolbox)

### 構造
```
.
├ app/                              このディレクトリの下に諸々のファイルを置く
│  │                               .js, .ts, .tsx, .json以外はビルド時にdistディレクトリにそのままコピーされる
│  ├ _locales/                     言語ファイル
│  ├ res/                          コード以外のファイル（画像など）を入れる
│  ├ src/                          .ts, .html, .cssなど
│  └ manifest.json                 拡張機能のマニフェスト
├ dist/                             webpackはここにビルド結果を出力する
├ packages/                         npm run buildするとここに拡張機能ファイルが出力される
├ entry-points.json                 app/src/background.tsから参照されていなくて、app/manifest.jsonのcontent_scriptsにも書いていないけども
│                                   ビルドされてほしい.tsファイルはここに書く
└ webextension-toolbox-config.js    webpackの構成はここに書く
```

## 募
- 翻訳（英語、中国語など？）
