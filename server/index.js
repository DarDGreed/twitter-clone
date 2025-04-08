import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.routes.js"

import connectDB from "./config/connectDB.js"


const app = express()
const PORT = process.env.PORT || 3000
dotenv.config() // to read .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}) // to configure cloudinary

// Middleware
app.use(express.json()) // to parse JSON data
app.use(express.urlencoded({extended: true})) // to parse form data
app.use(cookieParser()) // to parse cookies

app.get("/", (req,res) => {
  res.send("hello from server")
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`)
  connectDB() // connect to database
})