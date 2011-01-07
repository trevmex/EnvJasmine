#!/usr/bin/env bash

cd `dirname "$0"`
java -jar ../lib/rhino/js.jar ../lib/envjasmine.js `ls -m ../specs | sed -e s/,//g`
