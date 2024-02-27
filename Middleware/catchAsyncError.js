//this is for avoid try catch....
module.exports=(theFunc)=>(req,res,next)=>{
          Promise.resolve(theFunc(req,res,next)).catch(next)
}