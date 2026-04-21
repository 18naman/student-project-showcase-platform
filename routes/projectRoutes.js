const router=require("express").Router()

const multer=require("multer")

const Project=require("../models/project")

const Comment=require("../models/comment")


// image storage

const storage=multer.diskStorage({

destination:"uploads",

filename:(req,file,cb)=>{

cb(null,Date.now()+file.originalname)

}

})

const upload=multer({storage})


// add project page

router.get("/add",(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

res.render("addProject")

})


// add project (image optional)

router.post("/add",upload.single("image"),async(req,res)=>{

let imageName="default.png"

if(req.file){

imageName=req.file.filename

}

await Project.create({

title:req.body.title,

description:req.body.description,

link:req.body.link,

image:imageName,

studentId:req.session.student._id,

status:"pending"

})

res.redirect("/project/my")

})


// my projects

router.get("/my",async(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

const projects=await Project.find({

studentId:req.session.student._id

})

res.render("myProjects",{projects})

})


// edit project page

router.get("/edit/:id",async(req,res)=>{

const project=await Project.findById(

req.params.id

)

res.render("editProject",{project})

})


// update project

router.post("/update/:id",async(req,res)=>{

await Project.findByIdAndUpdate(

req.params.id,

{

title:req.body.title,

description:req.body.description,

link:req.body.link

}

)

res.redirect("/project/my")

})


// delete project

router.post("/delete/:id",async(req,res)=>{

await Project.findByIdAndDelete(

req.params.id

)

res.redirect("/project/my")

})


// project details

router.get("/details/:id",async(req,res)=>{

const project=await Project.findById(

req.params.id

)

const comments=await Comment.find({

projectId:req.params.id

})

res.render("projectDetails",{

project,
comments

})

})


// like project

router.post("/like/:id",async(req,res)=>{

const p=await Project.findById(req.params.id)

p.likes++

await p.save()

res.redirect("/project/details/"+req.params.id)

})


// comment

router.post("/comment/:id",async(req,res)=>{

await Comment.create({

text:req.body.text,

projectId:req.params.id,

userEmail:req.session.student.email

})

res.redirect("/project/details/"+req.params.id)

})

module.exports=router