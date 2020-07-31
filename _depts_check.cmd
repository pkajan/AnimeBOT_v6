@cmd /c @ncu

@echo off
setlocal
:PROMPT
@echo(
SET /P AREYOUSURE=Do you want to update package.json (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
@cmd /c @ncu -u

@echo(
SET /P INSTALL=Do you want to update (Y/[N])?
IF /I "%INSTALL%" NEQ "Y" GOTO END
@cmd /c npm update


:END
endlocal
@pause
exit
