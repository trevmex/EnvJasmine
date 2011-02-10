#!/usr/bin/env bash

cd "`dirname \"$0\"`"
java -Duser.timezone="US/Eastern" -jar ../lib/rhino/js.jar ../lib/envjasmine.js `ls -m ../specs | sed -e s/,//g`
