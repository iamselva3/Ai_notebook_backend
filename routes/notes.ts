// import { Hono } from "hono"
// import { Note } from "../models/note"
// import { authMiddleware } from "../middleware/auth"
// import type { AuthUser } from "../types/auth"

// const app = new Hono()

// // Debug middleware
// app.use("*", async (c, next) => {
//   console.log(`📝 Notes route hit: ${c.req.method} ${c.req.path}`)
//   await next()
// })

// // Add a public test endpoint FIRST
// app.get("/public-test", (c) => {
//   return c.json({ message: "Public notes endpoint works" })
// })

// // Then protect all other routes
// app.use("*", authMiddleware)

// // Now add a protected test
// app.get("/protected-test", async (c) => {
//   try {
//     const user = c.get("user") as AuthUser
//     return c.json({ 
//       message: "Protected route works", 
//       userId: user.id 
//     })
//   } catch (error) {
//     console.error("Auth error:", error)
//     return c.json({ error: "Authentication failed" }, 401)
//   }
// })

// // Your existing routes
// app.post("/", async (c) => {
//   console.log("📝 Creating note...")
  
//   try {
//     const user = c.get("user") as AuthUser
//     const body = await c.req.json()
    
//     console.log("User ID:", user.id)
//     console.log("Note data:", body)

//     const note = await Note.create({
//       title: body.title,
//       content: body.content,
//       tags: body.tags ?? [],
//       userId: user.id,
//     })

//     console.log("✅ Note created:", note._id)
//     return c.json(note, 201)
    
//   } catch (error) {
//     console.error("❌ Error creating note:", error)
//     return c.json({ error: "Failed to create note" }, 500)
//   }
// })

// app.get("/", async (c) => {
//   console.log("📝 Getting notes...")
  
//   try {
//     const user = c.get("user") as AuthUser
//     console.log("User ID for notes:", user.id)

//     const notes = await Note.find({
//       userId: user.id,
//     })

//     console.log(`✅ Found ${notes.length} notes`)
//     return c.json(notes)
    
//   } catch (error) {
//     console.error("❌ Error fetching notes:", error)
//     return c.json({ error: "Failed to fetch notes" }, 500)
//   }
// })

// export default app


import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth"
import {
  publicTest,
  protectedTest,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controller/notes"
import { appendFile } from "node:fs/promises"

const app = new Hono()

// Debug middleware
app.use("*", async (c, next) => {
  console.log(`📝 Notes  hit: ${c.req.method} ${c.req.path}`)
  await next()
})

// Public route
app.get("/public-test", publicTest)

// Protect everything below
app.use("*", authMiddleware)

// Protected test
app.get("/protected-test", protectedTest)

// Notes routes
app.post("/", createNote)
app.get("/", getNotes)

app.get("/:id", getNoteById)
app.put("/:id", updateNote)
app.patch("/:id", updateNote)
app.delete("/:id", deleteNote)

export default app
