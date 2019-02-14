# DndProfiler

### Building client (generates files in server/wwwroot)
```
cd client
npm install
npm run build
```

### Running webpack dev server for client
```
cd client
npm run serve
```

### Building server (server/wwwroot files have to be generated first by building client)
```
cd server
dotnet build
```

### Running server
```
cd server
dotnet run
```

