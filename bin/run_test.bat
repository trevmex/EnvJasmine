echo off

set PWD=%cd%
set SPEC=%~f1
cd %~f0\..
set ROOT=%cd%\..
java -Duser.timezone="US/Eastern" -jar "%ROOT%\lib\rhino\js.jar" "%ROOT%\lib\envjasmine.js" "WIN" "%ROOT%" "%SPEC%"
cd %PWD%
