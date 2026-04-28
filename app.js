require("dotenv").config()

const express=require("express")
const mongoose=require("mongoose")
const session=require("express-session")

const app=express()

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))

app.set("view engine","ejs")

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use("/uploads",express.static("uploads"))

app.use(session({

secret:"secret123",
resave:false,
saveUninitialized:false

}))

app.use((req,res,next)=>{

res.locals.student=req.session.student
res.locals.admin=req.session.admin

next()

})

app.use("/",require("./routes/authRoutes"))
app.use("/project",require("./routes/projectRoutes"))
app.use("/admin",require("./routes/adminRoutes"))
app.use("/uploads", express.static("uploads"))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log("Server running"))