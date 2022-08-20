const express=require("express");
const router=express.Router();
const User=require("../Usermodel/usermodel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
// require("dotenv").config()
const { body, validationResult } = require('express-validator');


// Register API

router.post("/register",[body("email").isEmail().withMessage("Email is not valid")],async(req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
   let user= await User.findOne({email:req.body.email})
// check if user already exist or not 
if(user){
    return res.status(400).json({success:false,message:"User already exist"})
}
// To hash a password
const salt=await bcrypt.genSalt(10);
const hashPassword=await bcrypt.hash(req.body.password,salt)

user=await User.create({
    name:req.body.name,
    email:req.body.email,
    password:hashPassword
})
// to generate a token
const data={
    user:{id:user._id}
}
const authToken=jwt.sign(data,"ASSIGNMENT")
 return res.status(201).json({success:true,user})


  }catch(err){
     return res.status(400).json({message:err.message})
  }
})


// Login API
router.post("/login",[body("email").isEmail().withMessage("Email is not valid")],async(req,res)=>{
    const{email,password}=req.body;
    let user=await User.findOne({email:email});
    if(!user){
        return res.status(400).json({success:true,message:"Incorrect email or password"})
    }
    let passCompare=await bcrypt.compare(password,user.password);
    if(!passCompare){
        return res.status(400).json({success:true,message:"Incorrect email or password"})
    }
    // to generate a token
const data={
    user:{id:user._id}
}
const authToken=jwt.sign(data,"ASSIGNMENT")
 return res.status(200).json({success:true,user})

})


module.exports=router