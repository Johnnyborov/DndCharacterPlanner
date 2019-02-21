#!/usr/bin/env bash

scriptdir="$(dirname "$(readlink -f "$0")")"
cd "$scriptdir"

cd ../client
npm run build

cd ../utilities/WebScraper
dotnet build -c Release
dotnet run -c Release --scrape-files --silent

cd ../../server
dotnet build -c Release

exit 0