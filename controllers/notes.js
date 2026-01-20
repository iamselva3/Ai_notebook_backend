import { Note } from "../models/note.js";
import { ObjectId } from "mongodb";

// Public test
export const publicTest = async (req, res) => {
    return res.json({ message: "Public notes endpoint works" });
};

// Protected test
export const protectedTest = async (req, res) => {
    try {
        return res.json({
            message: "Protected route works",
            userId: req.user.id,
        });
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ error: "Authentication failed" });
    }
};

// Create note
export const createNote = async (req, res) => {
    console.log(" Creating note...");

    try {
        // req.user is set by authMiddleware
        const user = req.user;
        const body = req.body;

        const note = await Note.create({
            title: body.title,
            content: body.content,
            tags: body.tags ?? [],
            userId: user.id,
        });

        console.log(" Note created:", note._id);
        return res.status(201).json(note);
    } catch (error) {
        console.error(" Error creating note:", error);
        return res.status(500).json({ error: "Failed to create note" });
    }
};

// Get notes
export const getNotes = async (req, res) => {
    console.log(" Getting notes...");

    try {
        const user = req.user;

        const notes = await Note.find({
            userId: user.id,
        }).sort({ createdAt: -1 });

        console.log(`Found ${notes.length} notes`);
        return res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching notes:", error);
        return res.status(500).json({ error: "Failed to fetch notes" });
    }
};

export const getNoteById = async (req, res) => {
    console.log(" Getting note by ID...");

    try {
        const user = req.user;
        const noteId = req.params.id;
        console.log(" Note ID:", noteId);

        // Validate note ID
        if (!ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        const note = await Note.findOne({
            _id: new ObjectId(noteId),
            userId: user.id,
        });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        console.log(" Note found:", note._id);
        return res.json(note);
    } catch (error) {
        console.error("❌ Error fetching note:", error);
        return res.status(500).json({ error: "Failed to fetch note" });
    }
};

// Update note (EDIT)
export const updateNote = async (req, res) => {
    console.log(" Updating note...");

    try {
        const user = req.user;
        const noteId = req.params.id;
        const body = req.body;

        // Validate note ID
        if (!ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        // Validate required fields
        if (!body.title?.trim() || !body.content?.trim()) {
            return res.status(400).json({ error: "Title and content are required" });
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
        );

        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        console.log(" Note updated:", updatedNote._id);
        return res.json(updatedNote);
    } catch (error) {
        console.error("❌ Error updating note:", error);
        return res.status(500).json({ error: "Failed to update note" });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    console.log(" Deleting note...");

    try {
        const user = req.user;
        const noteId = req.params.id;

        // Validate note ID
        if (!ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        // Find and delete note
        const deletedNote = await Note.findOneAndDelete({
            _id: new ObjectId(noteId),
            userId: user.id, // Ensure user owns the note
        });

        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        console.log(" Note deleted:", deletedNote._id);
        return res.json({
            success: true,
            message: "Note deleted successfully",
            noteId: deletedNote._id
        });
    } catch (error) {
        console.error("❌ Error deleting note:", error);
        return res.status(500).json({ error: "Failed to delete note" });
    }
};
