#!/usr/bin/env bash

cd "`dirname \"$0\"`"
PWD=$(pwd)
java -Duser.timezone="US/Eastern" -jar "$PWD/../lib/rhino/js.jar" "$PWD/../lib/envjasmine.js" --environment="UNIX" --rootDir="$PWD/.." $*
