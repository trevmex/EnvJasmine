echo off

java -Duser.timezone="US/Eastern" -jar "..\lib\rhino\js.jar" "..\lib\envjasmine.js" "WIN" ".." "%~f1"
