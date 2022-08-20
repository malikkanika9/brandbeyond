const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors=require("cors");
const mongoose=require("mongoose");
require("dotenv").config({path:"../routes/env"})

// database connection
mongoose.connect("mongodb://127.0.0.1:27017/detail").then(()=>console.log("database connected"))


app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/userroute"))





app.listen(port,()=>{
    console.log(`app is running on port 6000`)
})