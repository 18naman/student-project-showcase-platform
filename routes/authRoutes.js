const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Student = require("../models/student")
const Project = require("../models/project")


router.get("/", async(req,res)=>{

const projects = await Project.find({

status:"approved"

})

res.render("explore",{projects})

})


router.get("/login",(req,res)=>{

res.render("login",{error:null})

})


router.post("/login", async(req,res)=>{

const student = await Student.findOne({

email:req.body.email

})

if(!student)

return res.render("login",{

error:"Email not registered"

})

const valid = await bcrypt.compare(

req.body.password,
student.password

)

if(!valid)

return res.render("login",{

error:"Incorrect password"

})

req.session.student = student

res.redirect("/")

})


router.get("/register",(req,res)=>{

res.render("register")

})


router.post("/register", async(req,res)=>{

const hash = await bcrypt.hash(

req.body.password,
10

)

await Student.create({

name:req.body.name,

usn:req.body.usn,

email:req.body.email,

password:hash

})

res.redirect("/login")

})


router.get("/logout",(req,res)=>{

req.session.destroy()

res.redirect("/")

})


router.get("/profile",(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

res.render("profile",{

user:req.session.student

})

})

module.exports = router