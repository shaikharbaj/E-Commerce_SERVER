const mongoose = require('mongoose')
const Connect =async()=>{
     const data =  await mongoose.connect(process.env.mongodbConnection)
     console.log(`database connected successfully..`);
}

module.exports= Connect;