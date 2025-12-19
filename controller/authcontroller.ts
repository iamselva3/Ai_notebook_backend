import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/user"
import type { Context } from "hono"

// Register
export const register = async (c: Context) => {
  const { email, password } = await c.req.json()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    console.error("User already exists with email:", email)
    return c.json({ error: "User already exists" }, 400)
  }

  const hash = await bcrypt.hash(password, 10)
  await User.create({ email, password: hash })

  return c.json({ success: true }, 201)
}

// Login
export const login = async (c: Context) => {
  console.log("Login attempt received")

  const { email, password } = await c.req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401)
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return c.json({ error: "Invalid credentials" }, 401)
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing")
    return c.json({ error: "Server misconfiguration" }, 500)
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  )

  return c.json({ token })
}

// Health check
export const ping = (c: Context) => {
  return c.text("auth alive")
}
