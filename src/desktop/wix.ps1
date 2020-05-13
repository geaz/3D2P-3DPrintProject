echo "Setting WIX"
$env:Path+=";$env:WIX\bin"
$env:Path

echo "Build app.js"
npm --prefix ..\app run build:desktop

echo "Build Project"
dotnet publish PrintProject.App/PrintProject.App.csproj --runtime win-x64 --configuration Release

mkdir wixBuild
cd wixBuild

echo "Harvest ApplicationFiles"
heat dir ../PrintProject.App/bin/Release/netcoreapp3.1/win-x64/publish -o Files.wxs -dr INSTALLDIR -cg ApplicationFiles -gg -sreg -srd -scom

echo "Executing Candle"
candle ../PrintProject.App/PrintProject.App.wxs Files.wxs -ext WixUIExtension -ext WixUtilExtension

echo "Executing Light"
light PrintProject.App.wixobj Files.wixobj -ext WixUIExtension -ext WixUtilExtension -b ../PrintProject.App/bin/Release/netcoreapp3.1/win-x64/publish -o 3D2P