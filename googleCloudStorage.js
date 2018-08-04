const restify = require("restify");
const cors = require('cors')

console.log(Object.keys(restify))

const server = restify.createServer({
  name: 'restify-boilerplate',
});

server.use(restify.bodyParser());




const fs = require("fs");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "memes_with_friends";
const storage = Storage({
  projectId: '595499118100',
  keyFilename: '/Users/howardchong/horizons/mwf-image-deck-server/GCSserverkey.json'
})
const bucket = storage.bucket(CLOUD_BUCKET);

const GCSupload = (req, res) => {
  console.count("UPLOADING")
  const {file} = req.files;
  const gcsname = uuidv4() + file.name;
  console.log("FILE", file.name)
  const files = bucket.file(gcsname);

  fs.createReadStream(file.path)
    .pipe(files.createWriteStream({
      metadata: {
        contentType: file.type
      }
    }))
    .on("error", (err) => {
      res.json(err);
    })
    .on('finish', () => {
      res.json({
        success: true,
        fileUrl: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`
      })
    });
};

server.use(bodyParser());
server.post("/uploadToGCS", GCSupload);


let port= 31023;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});