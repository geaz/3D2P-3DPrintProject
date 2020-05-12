#!/bin/sh

npm run --prefix ../app build:desktop
dotnet publish PrintProject.App/PrintProject.App.csproj -c Release -r linux-x64