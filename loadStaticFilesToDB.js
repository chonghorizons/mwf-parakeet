const axios = require('axios')

var starterFiles= require('./startingFiles.json');
myAddRoute="http://10.2.102.226:3195/api/v1/Image"
starterFiles.forEach((x)=>{
  console.log(x)
  axios.post(myAddRoute, x)
  .then(response=>console.log("RESPONSE", response))
  .catch(err=>console.log("ERROR", err))
})
