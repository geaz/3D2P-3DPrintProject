@echo off

echo Build app.js
call npm --prefix ..\app run build:desktop

echo Build Project
call dotnet publish PrintProject.App/PrintProject.App.csproj --runtime win-x64 --configuration Release

call mkdir wixBuild
call cd wixBuild

echo Harvest ApplicationFiles
call heat dir ../PrintProject.App/bin/Release/netcoreapp3.1/win-x64/publish -o Files.wxs -dr INSTALLDIR -cg ApplicationFiles -gg -sreg -srd -scom

echo Executing Candle
call candle ../PrintProject.App/PrintProject.App.wxs Files.wxs -ext WixUIExtension -ext WixUtilExtension

echo Executing Light 
call light PrintProject.App.wixobj Files.wixobj -ext WixUIExtension -ext WixUtilExtension -b ../PrintProject.App/bin/Release/netcoreapp3.1/win-x64/publish -o 3D2P