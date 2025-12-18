import { Schema, model, InferSchemaType } from "mongoose"

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export type NoteType = InferSchemaType<typeof noteSchema>

export const Note = model<NoteType>("Note", noteSchema)
