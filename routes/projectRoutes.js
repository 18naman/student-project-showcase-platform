const router = require("express").Router()
const multer = require("multer")
const path = require("path")

const Project = require("../models/project")
const Comment = require("../models/comment")

const {
    isStudent
} = require("../middleware/authMiddleware")


// MULTER STORAGE

const storage = multer.diskStorage({

    destination: "public/uploads",

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        )
    }
})

const upload = multer({
    storage
})


// ADD PROJECT PAGE

router.get("/add", isStudent, (req, res) => {

    res.render("addProject")
})


// ADD PROJECT

router.post(
    "/add",
    isStudent,
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.send("Image required")
            }

            await Project.create({

                title: req.body.title,

                description: req.body.description,

                category: req.body.category,

                link: req.body.link,

                image: req.file.filename,

                studentId: req.session.student._id,

                status: "pending"
            })

            res.redirect("/project/my")

        } catch (err) {

            console.log(err)

            res.send("Error uploading project")
        }
    }
)


// MY PROJECTS

router.get("/my", isStudent, async (req, res) => {

    const projects = await Project.find({

        studentId: req.session.student._id
    })

    res.render("myProjects", {
        projects
    })
})


// EDIT PAGE

router.get("/edit/:id", isStudent, async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/project/my")
    }

    if (
        project.studentId != req.session.student._id
    ) {
        return res.redirect("/project/my")
    }

    res.render("editProject", {
        project
    })
})


// UPDATE PROJECT

router.post("/update/:id", isStudent, async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/project/my")
    }

    if (
        project.studentId != req.session.student._id
    ) {
        return res.redirect("/project/my")
    }

    await Project.findByIdAndUpdate(

        req.params.id,

        {

            title: req.body.title,

            description: req.body.description,

            link: req.body.link,

            status: "pending",

            adminMessage: ""
        }
    )

    res.redirect("/project/my")
})


// DELETE PROJECT

router.post("/delete/:id", isStudent, async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/project/my")
    }

    if (
        project.studentId != req.session.student._id
    ) {
        return res.redirect("/project/my")
    }

    await Project.findByIdAndDelete(
        req.params.id
    )

    res.redirect("/project/my")
})


// PROJECT DETAILS

router.get("/details/:id", async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/")
    }

    const comments = await Comment.find({

        projectId: req.params.id
    })

    res.render("projectDetails", {

        project,
        comments
    })
})


// LIKE PROJECT

router.post("/like/:id", isStudent, async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/")
    }

    project.likes++

    await project.save()

    res.redirect(
        "/project/details/" + req.params.id
    )
})


// COMMENT

router.post(
    "/comment/:id",
    isStudent,
    async (req, res) => {

        if (!req.body.text) {
            return res.redirect(
                "/project/details/" + req.params.id
            )
        }

        await Comment.create({

            text: req.body.text,

            projectId: req.params.id,

            userEmail: req.session.student.email
        })

        res.redirect(
            "/project/details/" + req.params.id
        )
    }
)

module.exports = router