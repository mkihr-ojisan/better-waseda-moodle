#!/bin/bash

cd src

jq 'keys[]' _locales/ja/messages.json | while read key; do
    if [ `grep -r --exclude-dir=_locales "$key" | wc -l` -eq 0 ]; then
        echo $key
    fi
done