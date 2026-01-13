import { Note } from "../models/note"
import type { AuthUser } from "../types/auth"
import type { Context } from "hono"
import { ObjectId } from "mongodb"

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
  console.log(" Creating note...")

  try {
    const user = c.get("user") as AuthUser
    const body = await c.req.json()

    const note = await Note.create({
      title: body.title,
      content: body.content,
      tags: body.tags ?? [],
      userId: user.id,
    })

    console.log(" Note created:", note._id)
    return c.json(note, 201)
  } catch (error) {
    console.error(" Error creating note:", error)
    return c.json({ error: "Failed to create note" }, 500)
  }
}

// Get notes
export const getNotes = async (c: Context) => {
  console.log(" Getting notes...")

  try {
    const user = c.get("user") as AuthUser

    const notes = await Note.find({
      userId: user.id,
    }).sort({ createdAt: -1 })

    console.log(`Found ${notes.length} notes`)
    return c.json(notes)
  } catch (error) {
    console.error("❌ Error fetching notes:", error)
    return c.json({ error: "Failed to fetch notes" }, 500)
  }
}

export const getNoteById = async (c: Context) => {
  console.log(" Getting note by ID...")

  try {
    const user = c.get("user") as AuthUser
    const noteId = c.req.param("id")
    console.log(" Note ID:", noteId)

    // Validate note ID
    if (!ObjectId.isValid(noteId)) {
      return c.json({ error: "Invalid note ID" }, 400)
    }

    const note = await Note.findOne({
      _id: new ObjectId(noteId),
      userId: user.id,
    })

    if (!note) {
      return c.json({ error: "Note not found" }, 404)
    }

    console.log(" Note found:", note._id)
    return c.json(note)
  } catch (error) {
    console.error("❌ Error fetching note:", error)
    return c.json({ error: "Failed to fetch note" }, 500)
  }
}

// Update note (EDIT)
export const updateNote = async (c: Context) => {
  console.log(" Updating note...")

  try {
    const user = c.get("user") as AuthUser
    const noteId = c.req.param("id")
    const body = await c.req.json()

    // Validate note ID
    if (!ObjectId.isValid(noteId)) {
      return c.json({ error: "Invalid note ID" }, 400)
    }

    // Validate required fields
    if (!body.title?.trim() || !body.content?.trim()) {
      return c.json({ error: "Title and content are required" }, 400)
    }

    // Find and update note
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: new ObjectId(noteId),
        userId: user.id, // Ensure user owns the note
      },
      {
        $set: {
          title: body.title.trim(),
          content: body.content.trim(),
          tags: body.tags ?? [],
          updatedAt: new Date(),
        },
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    )

    if (!updatedNote) {
      return c.json({ error: "Note not found or unauthorized" }, 404)
    }

    console.log(" Note updated:", updatedNote._id)
    return c.json(updatedNote)
  } catch (error) {
    console.error("❌ Error updating note:", error)
    return c.json({ error: "Failed to update note" }, 500)
  }
}

// Delete note
export const deleteNote = async (c: Context) => {
  console.log(" Deleting note...")

  try {
    const user = c.get("user") as AuthUser
    const noteId = c.req.param("id")

    // Validate note ID
    if (!ObjectId.isValid(noteId)) {
      return c.json({ error: "Invalid note ID" }, 400)
    }

    // Find and delete note
    const deletedNote = await Note.findOneAndDelete({
      _id: new ObjectId(noteId),
      userId: user.id, // Ensure user owns the note
    })

    if (!deletedNote) {
      return c.json({ error: "Note not found or unauthorized" }, 404)
    }

    console.log(" Note deleted:", deletedNote._id)
    return c.json({
      success: true,
      message: "Note deleted successfully",
      noteId: deletedNote._id
    })
  } catch (error) {
    console.error("❌ Error deleting note:", error)
    return c.json({ error: "Failed to delete note" }, 500)
  }
}