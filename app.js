require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const path = require("path")

const app = express()

// DATABASE CONNECTION

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))


// VIEW ENGINE

app.set("view engine", "ejs")


// MIDDLEWARE

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// STATIC FILES

app.use(express.static("public"))

app.use(
    "/uploads",
    express.static(path.join(__dirname, "public/uploads"))
)


// SESSION

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))


// GLOBAL VARIABLES

app.use((req, res, next) => {

    res.locals.student = req.session.student || null
    res.locals.admin = req.session.admin || null

    next()
})


// ROUTES

app.use("/", require("./routes/authRoutes"))
app.use("/project", require("./routes/projectRoutes"))
app.use("/admin", require("./routes/adminRoutes"))


// SERVER

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

