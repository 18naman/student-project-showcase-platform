const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Admin = require("../models/admin")
const Student = require("../models/student")
const Project = require("../models/project")


// Admin register

router.get("/register", (req, res) => {

res.render("adminRegister")

})

router.post("/register", async (req, res) => {

const hash = await bcrypt.hash(req.body.password, 10)

await Admin.create({

name: req.body.name,

employeeId: req.body.employeeId,

email: req.body.email,

password: hash

})

res.redirect("/admin/login")

})


// Admin login page

router.get("/login", (req, res) => {

res.render("adminLogin", { error: null })

})


// Admin login check

router.post("/login", async (req, res) => {

const admin = await Admin.findOne({

email: req.body.email

})

if (!admin)

return res.render("adminLogin", {

error: "Admin not found"

})

const valid = await bcrypt.compare(

req.body.password,
admin.password

)

if (!valid)

return res.render("adminLogin", {

error: "Incorrect password"

})

req.session.admin = admin

res.redirect("/admin/dashboard")

})


// Dashboard

router.get("/dashboard", async (req, res) => {

if (!req.session.admin)

return res.redirect("/admin/login")

const students = await Student.find()

const projects = await Project.find()

res.render("adminDashboard", {

students,

projects

})

})


// Approve project

router.post("/approve/:id", async (req, res) => {

await Project.findByIdAndUpdate(

req.params.id,

{ approved: true }

)

res.redirect("/admin/dashboard")

})


// Delete project

router.post("/deleteProject/:id", async (req, res) => {

await Project.findByIdAndDelete(req.params.id)

res.redirect("/admin/dashboard")

})


// Delete student

router.post("/deleteStudent/:id", async (req, res) => {

await Student.findByIdAndDelete(req.params.id)

res.redirect("/admin/dashboard")

})


// Admin logout

router.get("/logout", (req, res) => {

req.session.admin = null

res.redirect("/admin/login")

})


// Forgot password

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


router.post("/forgot", async (req, res) => {

const admin = await Admin.findOne({

email: req.body.email

})

if (!admin)

return res.render("adminForgot", {

captcha: req.session.captcha,

error: "Email not found"

})

if (req.body.captcha !== req.session.captcha)

return res.render("adminForgot", {

captcha: req.session.captcha,

error: "Captcha incorrect"

})

res.render("adminReset", {

email: req.body.email

})

})


router.post("/reset-password", async (req, res) => {

const hash = await bcrypt.hash(req.body.password, 10)

await Admin.findOneAndUpdate(

{ email: req.body.email },

{ password: hash }

)

res.redirect("/admin/login")

})

module.exports = router