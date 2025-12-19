import { Note } from "../models/note"
import type { AuthUser } from "../types/auth"
import type { Context } from "hono"

// Public test
export const publicTest = async (c: Context) => {
  return c.json({ message: "Public notes endpoint works" })
}

// Protected test
export const protectedTest = async (c: Context) => {
  try {
    const user = c.get("user") as AuthUser
    return c.json({
      message: "Protected route works",
      userId: user.id,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return c.json({ error: "Authentication failed" }, 401)
  }
}

// Create note
export const createNote = async (c: Context) => {
  console.log("📝 Creating note...")

  try {
    const user = c.get("user") as AuthUser
    const body = await c.req.json()

    const note = await Note.create({
      title: body.title,
      content: body.content,
      tags: body.tags ?? [],
      userId: user.id,
    })

    console.log("✅ Note created:", note._id)
    return c.json(note, 201)
  } catch (error) {
    console.error("❌ Error creating note:", error)
    return c.json({ error: "Failed to create note" }, 500)
  }
}

// Get notes
export const getNotes = async (c: Context) => {
  console.log("📝 Getting notes...")

  try {
    const user = c.get("user") as AuthUser

    const notes = await Note.find({
      userId: user.id,
    })

    console.log(`✅ Found ${notes.length} notes`)
    return c.json(notes)
  } catch (error) {
    console.error("❌ Error fetching notes:", error)
    return c.json({ error: "Failed to fetch notes" }, 500)
  }
}
