import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000
app.get("/", (req,res) => {
  res.send("hello from server")
})

app.use("/api/auth", authRoutes)
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`)
  connectDB()
})