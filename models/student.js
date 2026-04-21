const mongoose=require("mongoose")

const schema=new mongoose.Schema({

name:String,

usn:String,

email:String,

password:String

})

module.exports=mongoose.model("Student",schema)