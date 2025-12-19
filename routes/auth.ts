// import { Hono } from "hono"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import { User } from "../models/user"

// const app = new Hono()

// app.post("/register", async (c) => {
//   const { email, password } = await c.req.json()

//   const user = await User.findOne({ email })
//   if (user) {
//     console.error("User already exists with email:", email);
//     return c.json({ error: "User already exists" }, 400)
//   }

//   const hash = await bcrypt.hash(password, 10)
//   await User.create({ email, password: hash })

//   return c.json({ success: true })
// })

// app.post("/login", async (c) => {
//   console.log("Login attempt received");
//   const { email, password } = await c.req.json();

//   const user = await User.findOne({ email })
//   if (!user) {
//     return c.json({ error: "Invalid credentials" }, 401)
//   }

//   const match = await bcrypt.compare(password, user.password)
//   if (!match) {
//     return c.json({ error: "Invalid credentials" }, 401)
//   }

//   const token = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET as string
//   )

//   return c.json({ token })
// })

// app.get("/ping", (c) => {
//   return c.text("auth alive")
// })


// export default app


import { Hono } from "hono"
import { register, login, ping } from "../controller/authcontroller"

const app = new Hono()

app.post("/register", register)
app.post("/login", login)
app.get("/ping", ping)

export default app
