const mongoose=require("mongoose")

const schema=new mongoose.Schema({

title:String,

description:String,

link:String,

image:String,

likes:{type:Number,default:0},

approved:{type:Boolean,default:false},

studentId:String

})

module.exports=mongoose.model("Project",schema)