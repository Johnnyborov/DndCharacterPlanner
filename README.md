# DndCharacterPlanner

Character Planner for D&D


## Building client (generates files in server/wwwroot)
```
cd client
npm install
npm run build
```

## Running webpack dev server for client
```
cd client
npm run serve
```


## Building server (server/wwwroot files have to be generated first by building client)
```
cd server
dotnet build
```

## Running server
```
cd server
dotnet run
```


## Building WebScraper
```
cd utilities/WebScraper
dotnet build
```


## Using WebScraper

### Downloading pages from fandom site to local files
Files are downloaded to in utilities/webscraper_downloaded_pages
```
cd utilities/WebScraper
dotnet run --save-pages
```

### Parsing downloaded pages to json
Created file is server/Data/spells.json
```
cd utilities/WebScraper
dotnet run --scrape-files
```

### Parsing to json directly from the site
Created file is server/Data/spells.json
```
cd utilities/WebScraper
dotnet run --scrape-url
```

### Printing spells.json to a text file
Created file is utilities/WebScraper/spells.txt
```
cd utilities/WebScraper
dotnet run --print > spells.txt
```
