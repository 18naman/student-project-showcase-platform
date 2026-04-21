const router=require("express").Router()
const multer=require("multer")

const Project=require("../models/project")
const Comment=require("../models/comment")

const storage=multer.diskStorage({

destination:"uploads",

filename:(req,file,cb)=>{

cb(null,Date.now()+file.originalname)

}

})

const upload=multer({storage})


router.get("/add",(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

res.render("addProject")

})


router.post("/add",upload.single("image"),async(req,res)=>{

await Project.create({

title:req.body.title,

description:req.body.description,

link:req.body.link,

image:req.file.filename,

studentId:req.session.student._id,

approved:false

})

res.redirect("/project/my")

})


router.get("/my",async(req,res)=>{

if(!req.session.student)

return res.redirect("/login")

const projects=await Project.find({

studentId:req.session.student._id

})

res.render("myProjects",{projects})

})


router.get("/edit/:id",async(req,res)=>{

const project=await Project.findById(req.params.id)

res.render("editProject",{project})

})


router.post("/update/:id",async(req,res)=>{

await Project.findByIdAndUpdate(req.params.id,{

title:req.body.title,

description:req.body.description,

link:req.body.link

})

res.redirect("/project/my")

})


router.post("/delete/:id",async(req,res)=>{

await Project.findByIdAndDelete(req.params.id)

res.redirect("/project/my")

})


router.get("/details/:id",async(req,res)=>{

const project=await Project.findById(req.params.id)

const comments=await Comment.find({

projectId:req.params.id

})

res.render("projectDetails",{project,comments})

})


router.post("/like/:id",async(req,res)=>{

const p=await Project.findById(req.params.id)

p.likes++

await p.save()

res.redirect("/project/details/"+req.params.id)

})


router.post("/comment/:id",async(req,res)=>{

await Comment.create({

text:req.body.text,

projectId:req.params.id,

userEmail:req.session.student.email

})

res.redirect("/project/details/"+req.params.id)

})

module.exports=router