@echo off

echo Build app.js
call npm --prefix ..\app run build:desktop

echo Build Project
call dotnet publish --runtime win-x64 --configuration Release

echo Harvest ApplicationFiles
call heat dir bin/Release/netcoreapp3.1/win-x64/publish -o Files.wxs -dr INSTALLDIR -cg ApplicationFiles -gg -sreg -srd -scom

echo Executing Candle
call candle PrintProject.App.wxs Files.wxs -ext WixUIExtension -ext WixUtilExtension

echo Executing Light 
call light PrintProject.App.wixobj Files.wixobj -ext WixUIExtension -ext WixUtilExtension -b bin/Release/netcoreapp3.1/win-x64/publish -o 3D2P