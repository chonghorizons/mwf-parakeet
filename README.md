# mwf-parakeet

For the Memes With Friends hackathon app, this github repo sets up two things:
1) Google Cloud Server (port 31023)
2) ImageMasterDeck for the game (port 3195)

To do this, run 'npm run startBoth';

All routes are exposed for Rodrigo's gameplay backend.

The only route you REALLY need to know is the route:
```
  10.2.102.226:31023/SpecialUpload
  method: POST
  key: file, value: the file as a fs.createWriteStream.
  ```

see googleCloudStorage.js.

Also, the IPv4 is hard coded and we need to be on the same network. If we get new IPv4, we need to manually change the code.
`10.2.102.226`
