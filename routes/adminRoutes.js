const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Admin = require("../models/admin")
const Student = require("../models/student")
const Project = require("../models/project")
const Comment = require("../models/comment")


// login

router.get("/login",(req,res)=>{

res.render("adminLogin",{error:null})

})


router.post("/login", async(req,res)=>{

const admin = await Admin.findOne({

email:req.body.email

})

if(!admin)

return res.render("adminLogin",{

error:"Admin not found"

})

const valid = await bcrypt.compare(

req.body.password,
admin.password

)

if(!valid)

return res.render("adminLogin",{

error:"Incorrect password"

})

req.session.admin = admin

res.redirect("/admin/dashboard")

})


// register

router.get("/register",(req,res)=>{

res.render("adminRegister")

})


router.post("/register", async(req,res)=>{

const hash = await bcrypt.hash(req.body.password,10)

await Admin.create({

name:req.body.name,

employeeId:req.body.employeeId,

email:req.body.email,

password:hash

})

res.redirect("/admin/login")

})


// dashboard

router.get("/dashboard", async(req,res)=>{

if(!req.session.admin)

return res.redirect("/admin/login")

const students = await Student.find()

const projects = await Project.find()

res.render("adminDashboard",{

students,
projects

})

})


// view project

router.get("/view/:id", async(req,res)=>{

if(!req.session.admin)

return res.redirect("/admin/login")

const project = await Project.findById(

req.params.id

)

const comments = await Comment.find({

projectId:req.params.id

})

res.render("adminViewProject",{

project,
comments

})

})


// approve project

router.post("/approve/:id", async(req,res)=>{

await Project.findByIdAndUpdate(

req.params.id,

{

status:"approved",

adminMessage:"Project approved successfully"

}

)

res.redirect("/admin/dashboard")

})


// reject project with message

router.post("/reject/:id", async(req,res)=>{

await Project.findByIdAndUpdate(

req.params.id,

{

status:"rejected",

adminMessage:req.body.message

}

)

res.redirect("/admin/dashboard")

})


// logout

router.get("/logout",(req,res)=>{

req.session.admin=null

res.redirect("/admin/login")

})

module.exports = router