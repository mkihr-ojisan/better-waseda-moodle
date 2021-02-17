# Better Waseda Moodle

Waseda Moodleの使い勝手を多少良くするブラウザ拡張機能。

## 機能
- 自動ログイン
- その他の微調整（拡張機能の設定ページを参照）


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

## 構造
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
- アイコン