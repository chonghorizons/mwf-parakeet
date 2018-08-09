// utility function. This loads all the files froma a directory (myDir) via uploadToGCS.
// uploadToGCS does two things
// 1) uploads to google cloud storage
// 2) adds the image to the MasterDeck.

var fs = require('fs');
//var myDir= "/Users/howardchong/Downloads/Newpics/"

var files= fs.readdirSync(myDir);
var axios=require('axios');
var request=require('request')

var req;

for (let i=0; i<=files.length-1; i++) {
   req=request.post('http://10.2.102.226:31023/uploadToGCS', function(err, resp, body) {
    if (err) {
      console.log("ERROR!");
    } else {
      console.log('URL: ' + body);
    }
  })
  var form = req.form();
  form.append('file', fs.createReadStream(myDir+files[i]))
}


// function base64_encode(file) {
//   var bitmap = fs.readFileSync(file);
//   return new Buffer(bitmap).toString('base64')
// }
//
// let data=new FormData(myDir+files[0]);
// data.append(file, this.file)
//
//
// axios.post('http://10.2.102.226:31023/uploadToGCS', data, {
//   headers: {'Content-Type': "multipart/form-data"}
// })
// .then(x=>console.log("SUCCESS"))
// .catch(x=>console.log("CATCH"))

//console.log(files)
