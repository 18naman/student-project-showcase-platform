const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Student = require("../models/student")
const Project = require("../models/project")


// Explore page

router.get("/", async (req, res) => {

const projects = await Project.find({ approved: true })

res.render("explore", { projects })

})


// Login page

router.get("/login", (req, res) => {

res.render("login", { error: null })

})


// Login check

router.post("/login", async (req, res) => {

const student = await Student.findOne({

email: req.body.email

})

if (!student)

return res.render("login", {

error: "Email not registered"

})

const valid = await bcrypt.compare(

req.body.password,
student.password

)

if (!valid)

return res.render("login", {

error: "Incorrect password"

})

req.session.student = student

res.redirect("/")

})


// Register page

router.get("/register", (req, res) => {

res.render("register")

})


// Register

router.post("/register", async (req, res) => {

const hash = await bcrypt.hash(req.body.password, 10)

await Student.create({

name: req.body.name,

usn: req.body.usn,

email: req.body.email,

password: hash

})

res.redirect("/login")

})


// Logout

router.get("/logout", (req, res) => {

req.session.destroy()

res.redirect("/")

})


// Profile

router.get("/profile", (req, res) => {

if (!req.session.student)

return res.redirect("/login")

res.render("profile", {

user: req.session.student

})

})


// Forgot password

router.get("/forgot", (req, res) => {

const captcha = Math.random()

.toString(36)

.substring(2, 7)

.toUpperCase()

req.session.captcha = captcha

res.render("forgot", { captcha })

})


router.post("/forgot", async (req, res) => {

const student = await Student.findOne({

email: req.body.email

})

if (!student)

return res.render("forgot", {

captcha: req.session.captcha,

error: "Email not registered"

})

if (req.body.captcha !== req.session.captcha)

return res.render("forgot", {

captcha: req.session.captcha,

error: "Captcha incorrect"

})

res.render("resetPassword", {

email: req.body.email

})

})


// Reset password

router.post("/reset-password", async (req, res) => {

const hash = await bcrypt.hash(req.body.password, 10)

await Student.findOneAndUpdate(

{ email: req.body.email },

{ password: hash }

)

res.redirect("/login")

})

module.exports = router