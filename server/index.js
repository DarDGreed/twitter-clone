import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 3000
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/", (req,res) => {
  res.send("hello from server")
})

app.use("/api/auth", authRoutes)
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`)
  connectDB()
})