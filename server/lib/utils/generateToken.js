import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({userId},process.env.JWT_SECRET,{ // sign the token with secret key
    expiresIn: '15d'
  })

  res.cookie("jwt",token,{
    maxAge: 15*24*60*60*1000, // 15 days in milliseconds
    httpOnly: true, // to prevent XSS attacks
    sameSite: "strict", // to prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development" // to send cookie only over HTTPS in production
  })
}