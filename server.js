const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
const cors = require('cors')
const Storage= require('@google-cloud/storage')
// const Multer = require('multer')
const axios = require('axios')

app.use(bodyParser.json())
app.use(methodOverride())
app.use(cors())


// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open!');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error!');
});

console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
var Schema=mongoose.Schema

var Image= mongoose.model('Image', new mongoose.Schema({
  imageURL: String,
  categories: [String],
  createdAt: Date,
}))

var StoredGames= mongoose.model('Game', new mongoose.Schema({
  game: Schema.Types.Mixed
}))


restify.serve(router, Image)
restify.serve(router, StoredGames)


app.use(router)

app.get('/getOneSpecialCardThenEraseWithFallback', function(req, res) {
  Image.find({categories: "special"}).count().exec(function(err,count) {
    console.log("SPECIAL COUNT", count)
    if (count>0) {
      var random=Math.floor(Math.random()*count);
      Image.findOneAndRemove({categories: "special"})
      .exec(function(err, imageRecord) {
        if (err) {
          res.json(err)
        } else {
          res.json(imageRecord)
        }
      })
    } else {
      getOneImageRecordPromise()
      .then((imageRec)=>{res.json(imageRec)})
    }
  })
})

app.get('/removeSpecialCards', function(req,res) {
  Image.deleteMany({categories: "special"}).exec(
    function (err, imageRecords) {
      if(err) {
        res.json(err)
      } else {
        res.json(imageRecords)
      }
    }
  )
})

app.get('/getOneRandomCard', function(req,res) {
  Image.count().exec(function(err,count) {
    var random=Math.floor(Math.random()*count);
    Image.findOne().skip(random).exec(
      function (err, imageRecord) {
        if(err) {
          res.json(err)
        } else {
          res.json(imageRecord)
        }
      }
    )
  })
})

function getOneImageRecordPromise() {
  var thePromise= new Promise(function(resolve, reject) {
    Image.count().exec(function(err,count) {
      var random=Math.floor(Math.random()*count);
      Image.findOne().skip(random).exec(
        function (err, ImageRecords) {
          resolve(ImageRecords) /// zzzz does not handle error correctly.
        }
      )
    })
  })
  return(thePromise);
}

//
// function testPromise() {
//   var thePromise= new Promise(function(resolve, reject) {
//     setTimeout(resolve,100,'foo')
//   })
//   return(thePromise);
// }
//
// console.log("I DID")
// getOneImageRecordPromise()
// .then((x)=>{
//   console.log("========WHAT IS THIS????");
//   console.log(x);
// })
// console.log("THIS WRONG")


app.get('/getNRandomCard/:num', function(req,res) {
  console.log("getNRandomCard", new Date())
  var myPromises=[];
  for (var i=1; i<=req.params.num; i++) {
    myPromises.push(getOneImageRecordPromise())
  }
  Promise.all(myPromises).then((resultsArray)=> res.json(resultsArray))
})



let port= 3195;
app.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on port ${process.env.PORT || port}`)
})
