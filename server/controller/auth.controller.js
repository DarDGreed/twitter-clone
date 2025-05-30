import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
  try {
    const {fullname, username, email, password} = req.body // destructuring the request body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex for validating email format
    if(!emailRegex.test(email)){
      return res.status(400).json({error: "Invalid email format"})
    }
    const existingUser = await User.findOne({username}) // check if username already exists
    if(existingUser){
      return res.status(400).json({error: "Username already taken"})
    }
    const existingEmail = await User.findOne({email}) // check if email already exists
    if(existingEmail){
      return res.status(400).json({error: "Email already taken"})
    }
    if(password.length < 6){
      return res.status(400).json({error: "Password must be atleast 6 characters long"})
    }
    const salt = await bcrypt.genSalt(10) // generate salt for hashing password
    const hashedPassword = await bcrypt.hash(password, salt) // hash the password

    // create a new user
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword
    })

    if(newUser){
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save() // save the user to the database

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      })
    } else{
      res.status(400).json({error: "invalid user data"})
    }
  } catch (error) {
    console.error("Error in sign up controller", error.message)
    res.status(500).json({ error: "Internal server Error" })
  }
}

export const login = async (req,res) => {
  try {
    const {username, password} = await req.body
    const user = await User.findOne({username})
    const  isPasswordCorrect = await bcrypt.compare(password,user?.password || "") // compare the password with the hashed password in the database

    if(!user || !isPasswordCorrect){
      return res.status(400).json({error: "Invalid Username or Password"})
    }

    generateTokenAndSetCookie(user._id, res)
    if (req.cookies?.jwt) {
      return res.status(400).json({ error: "User already logged in" });
    }

      res.status(200).json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      })
  } catch (error) {
    console.error("Error in login controller", error.message)
    res.status(500).json({ error: "Internal server Error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","", {maxAge: 0})
    res.status(200).json({message: "Logged out successfully"})
  } catch (error) {
    console.error("Error in logout controller", error.message)
    res.status(500).json({error: "Internal Server Error"})
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.error("Error in getMe controller", error.message)
    res.status(500).json({error: "Internal Server error"})
  }
}