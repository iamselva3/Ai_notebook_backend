📝 AI Notebook – Full Stack Application

A full-stack AI-powered note-taking application built with Hono.js, MongoDB, JWT authentication, and Typescript (Vite).
Users can create notes, view them securely, and generate AI summaries using an external LLM provider.

🚀 Features
🔐 Authentication

User registration and login

JWT-based authentication

Protected routes for authenticated users only

🗒️ Notes Management

Create notes with title and content

View all saved notes for the logged-in user

Notes are user-scoped (data isolation)

🤖 AI Integration

Summarize notes using AI

AI summary available:

Before saving (draft summarization)

After saving (per-note summarization)

Uses OpenRouter (Mistral 7B) for LLM inference

🎨 Frontend UX

Built with Typescript + Vite

Styled using Tailwind CSS

Toast notifications for success/error feedback

Clean and responsive UI

🛠️ Tech Stack
Backend

Hono.js – lightweight backend framework

Node.js

MongoDB + Mongoose

JWT for authentication

OpenRouter API for AI summaries

Frontend

Typescript (Vite)

Tailwind CSS

***RUN COMMENT***

npm run build && npm start

### Environment Variables

Create a `.env` file in the root with the following keys:

MONGO_URI=
JWT_SECRET=
PORT=
OPENROUTER_API_KEY=
