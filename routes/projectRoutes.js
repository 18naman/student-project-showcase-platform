const router = require("express").Router()
const multer = require("multer")

const Project = require("../models/project")
const Comment = require("../models/comment")


// storage config

const storage = multer.diskStorage({

destination: function(req,file,cb){

cb(null,"uploads")

},

filename: function(req,file,cb){

cb(null, Date.now()+"-"+file.originalname)

}

})


// allow optional image

const upload = multer({

storage: storage,

fileFilter: (req,file,cb)=>{

cb(null,true)

}

})



// ADD PROJECT PAGE

router.get("/add",(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

res.render("addProject")

})



// ADD PROJECT (IMAGE OPTIONAL)

router.post("/add", upload.single("image"), async(req,res)=>{

let imageName = "default.png"


if(req.file && req.file.filename){

imageName = req.file.filename

}


await Project.create({

title: req.body.title,

description: req.body.description,

link: req.body.link,

image: imageName,

studentId: req.session.student._id,

status: "pending"

})

res.redirect("/project/my")

})



// MY PROJECTS

router.get("/my", async(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

const projects = await Project.find({

studentId: req.session.student._id

})

res.render("myProjects",{projects})

})



// EDIT PROJECT PAGE

router.get("/edit/:id", async(req,res)=>{

const project = await Project.findById(req.params.id)

res.render("editProject",{project})

})



// UPDATE PROJECT

router.post("/update/:id", async(req,res)=>{

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



// DELETE PROJECT

router.post("/delete/:id", async(req,res)=>{

await Project.findByIdAndDelete(req.params.id)

res.redirect("/project/my")

})



// PROJECT DETAILS

router.get("/details/:id", async(req,res)=>{

const project = await Project.findById(req.params.id)

const comments = await Comment.find({

projectId:req.params.id

})

res.render("projectDetails",{project,comments})

})



// LIKE

router.post("/like/:id", async(req,res)=>{

const project = await Project.findById(req.params.id)

project.likes++

await project.save()

res.redirect("/project/details/"+req.params.id)

})



// COMMENT

router.post("/comment/:id", async(req,res)=>{

await Comment.create({

text:req.body.text,

projectId:req.params.id,

userEmail:req.session.student.email

})

res.redirect("/project/details/"+req.params.id)

})


module.exports = router