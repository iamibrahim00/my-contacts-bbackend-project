const asyncHandler = require('express-async-handler')
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//Description  for register user
//route POST /user/register
//access public
const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered")
    }

    //Hash Password
    const hashPassword = await bcrypt.hash(password,10);
    console.log("HashPassword => ",hashPassword)
    const user = await User.create({
        username,
        email,
        password : hashPassword
    })
    console.log(`User Create : ${user}`)
    if(user){
        res.status(201).json({_id : user.id,email : user.email});

    }else{
        res.status(400);
        throw new Error("User data is not valid")
    }
    res.json({message:"Register the User"})
})

//Description  for  Login user
//route POST /user/login
//access public
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({email})
    //compare password with hashpassword
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user :{
                username : user.username,
                email : user.email,
                id : user.id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
        )
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("Email or PAssword is not valid")
    }
})

//Description current user info
//route POST /user/current
//access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user)
})

module.exports ={
    registerUser,
    loginUser,
    currentUser
}