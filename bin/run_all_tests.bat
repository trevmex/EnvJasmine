echo off

set dirList = dir /b/r/s ..\specs

java -Duser.timezone="US/Eastern" -jar "..\lib\rhino\js.jar" "..\lib\envjasmine.js" "WIN" ".." %dirList%
