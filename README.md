# DndCharacterPlanner

Character Planner for D&D 5th edition

It's a web application that allows to conveniently choose D&D character attributes, feats and spells for a specific class/subclass and level. It also allows to save it that created character on the server's database (and get a link) and later restore it via corresponding link.



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
WebScraper parses [D&D spells database site](https://dnd5e.fandom.com) to get a collection of spells and their attributes and descriptions and saves it as json file.


### Downloading pages from fandom site to local files
Files are downloaded to in utilities/webscraper_downloaded_pages
```
cd utilities/WebScraper
dotnet run --download-pages
```


### Parsing downloaded pages to json
Created file is server/Data/spells.json
```
cd utilities/WebScraper
dotnet run --scrape-files
```

##### To disable numerous messages add --silent as 2nd argument
```
cd utilities/WebScraper
dotnet run --scrape-files --silent
```


### Parsing to json directly from the site
Created file is server/Data/spells.json
```
cd utilities/WebScraper
dotnet run --scrape-url
```

##### To disable numerous messages add --silent as 2nd argument
```
cd utilities/WebScraper
dotnet run --scrape-url --silent
```


### Printing spells.json to a text file
Created file is utilities/WebScraper/spells.txt
```
cd utilities/WebScraper
dotnet run --print > spells.txt
```
