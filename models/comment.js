const mongoose=require("mongoose")

const schema=new mongoose.Schema({

text:String,

projectId:String,

userEmail:String

})

module.exports=mongoose.model("Comment",schema)