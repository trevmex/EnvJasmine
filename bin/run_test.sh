#!/usr/bin/env bash

cd "`dirname \"$0\"`"
PWD=$(pwd)
SPECS=`for i in $*; do echo -n "$PWD/../$i "; done`
java -Duser.timezone="US/Eastern" -jar "$PWD/../lib/rhino/js.jar" "$PWD/../lib/envjasmine.js" "UNIX" "$PWD/.." $SPECS
