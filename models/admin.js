const mongoose=require("mongoose")

const schema=new mongoose.Schema({

name:String,

employeeId:String,

email:String,

password:String

})

module.exports=mongoose.model("Admin",schema)