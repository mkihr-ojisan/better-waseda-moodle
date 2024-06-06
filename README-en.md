# Better Waseda Moodle

<img src="https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/main/src/res/images/icon.svg" alt="Better Waseda Moodle" width="128">

A browser extension that makes Waseda Moodle a little easier to use.

## Install

- [Firefox](https://github.com/mkihr-ojisan/better-waseda-moodle/releases/download/v0.9.2/better-waseda-moodle.v0.9.2.firefox.xpi)
- [Chrome](https://chrome.google.com/webstore/detail/better-waseda-moodle/omijfabnmlifcmmghegpbmoieibfbmmj)

## Main features

- Automatic login
- Timetable displayed on Moodle top page
- Clicking the toolbar icon displays the list of assignments
- Modify styles

To see all features, install the extension and open the settings page.

## Screenshots

![Dashboard](https://raw.githubusercontent.com/mkihr-ojisan/better-waseda-moodle/main/readme-images/dashboard.png "Dashboard")

## Build
### Requirements
- Node.js (v19.2.0)

```console
$ npm install
$ npm run build $VENDOR # "firefox" or "chrome"
$ ls packages/better-waseda-moodle.*.zip
```

### Tools used

- [webextension-toolbox](https://github.com/webextension-toolbox/webextension-toolbox)
