const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Admin = require("../models/admin")
const Student = require("../models/student")
const Project = require("../models/project")


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


router.get("/register",(req,res)=>{

res.render("adminRegister")

})


router.post("/register", async(req,res)=>{

const hash = await bcrypt.hash(

req.body.password,
10

)

await Admin.create({

name:req.body.name,

employeeId:req.body.employeeId,

email:req.body.email,

password:hash

})

res.redirect("/admin/login")

})


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


// approve

router.post("/approve/:id", async(req,res)=>{

await Project.findByIdAndUpdate(

req.params.id,

{status:"approved"}

)

res.redirect("/admin/dashboard")

})


// reject

router.post("/reject/:id", async(req,res)=>{

await Project.findByIdAndUpdate(

req.params.id,

{status:"rejected"}

)

res.redirect("/admin/dashboard")

})


// logout

router.get("/logout",(req,res)=>{

req.session.admin = null

res.redirect("/admin/login")

})

module.exports = router