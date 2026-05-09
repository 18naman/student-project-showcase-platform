const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Admin = require("../models/admin")
const Student = require("../models/student")
const Project = require("../models/project")
const Comment = require("../models/comment")

const {
    isAdmin
} = require("../middleware/authMiddleware")


// LOGIN PAGE

router.get("/login", (req, res) => {

    res.render("adminLogin", {
        error: null
    })
})


// LOGIN

router.post("/login", async (req, res) => {

    try {

        const admin = await Admin.findOne({
            email: req.body.email
        })

        if (!admin) {

            return res.render("adminLogin", {
                error: "Admin not found"
            })
        }

        const valid = await bcrypt.compare(
            req.body.password,
            admin.password
        )

        if (!valid) {

            return res.render("adminLogin", {
                error: "Incorrect password"
            })
        }

        req.session.admin = admin

        res.redirect("/admin/dashboard")

    } catch (err) {

        console.log(err)

        res.render("adminLogin", {
            error: "Login failed"
        })
    }
})


// REGISTER PAGE

router.get("/register", (req, res) => {

    res.render("adminRegister", {
        error: null
    })
})


// REGISTER

router.post("/register", async (req, res) => {

    try {

        const existing = await Admin.findOne({
            email: req.body.email
        })

        if (existing) {

            return res.render("adminRegister", {
                error: "Email already exists"
            })
        }

        const hash = await bcrypt.hash(
            req.body.password,
            10
        )

        await Admin.create({

            name: req.body.name,

            employeeId: req.body.employeeId,

            email: req.body.email,

            password: hash
        })

        res.redirect("/admin/login")

    } catch (err) {

        console.log(err)

        res.render("adminRegister", {
            error: "Registration failed"
        })
    }
})


// DASHBOARD

router.get("/dashboard", isAdmin, async (req, res) => {

    const students = await Student.find()

    const projects = await Project.find()

    res.render("adminDashboard", {

        students,
        projects
    })
})


// VIEW PROJECT

router.get("/view/:id", isAdmin, async (req, res) => {

    const project = await Project.findById(
        req.params.id
    )

    if (!project) {
        return res.redirect("/admin/dashboard")
    }

    const comments = await Comment.find({

        projectId: req.params.id
    })

    res.render("adminViewProject", {

        project,
        comments
    })
})


// APPROVE

router.post("/approve/:id", isAdmin, async (req, res) => {

    await Project.findByIdAndUpdate(

        req.params.id,

        {

            status: "approved",

            adminMessage:
                "Project approved successfully"
        }
    )

    res.redirect("/admin/dashboard")
})


// REJECT

router.post("/reject/:id", isAdmin, async (req, res) => {

    await Project.findByIdAndUpdate(

        req.params.id,

        {

            status: "rejected",

            adminMessage: req.body.message
        }
    )

    res.redirect("/admin/dashboard")
})


// DELETE STUDENT

router.post(
    "/deleteStudent/:id",
    isAdmin,
    async (req, res) => {

        await Student.findByIdAndDelete(
            req.params.id
        )

        res.redirect("/admin/dashboard")
    }
)


// LOGOUT

router.get("/logout", (req, res) => {

    req.session.admin = null

    res.redirect("/admin/login")
})


// FORGOT PASSWORD

router.get("/forgot", (req, res) => {

    const captcha = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()

    req.session.captcha = captcha

    res.render("adminForgot", {

        captcha,
        error: null
    })
})


// VERIFY CAPTCHA

router.post("/forgot", async (req, res) => {

    const admin = await Admin.findOne({

        email: req.body.email
    })

    if (!admin) {

        return res.render("adminForgot", {

            captcha: req.session.captcha,

            error: "Email not found"
        })
    }

    if (
        req.body.captcha !== req.session.captcha
    ) {

        return res.render("adminForgot", {

            captcha: req.session.captcha,

            error: "Captcha incorrect"
        })
    }

    res.render("adminReset", {

        email: req.body.email
    })
})


// RESET PASSWORD

router.post(
    "/reset-password",
    async (req, res) => {

        const hash = await bcrypt.hash(
            req.body.password,
            10
        )

        await Admin.findOneAndUpdate(

            { email: req.body.email },

            { password: hash }
        )

        res.redirect("/admin/login")
    }
)

module.exports = router