import "dotenv/config"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { serve } from "@hono/node-server"
import authRoutes from "./routes/auth"
import noteRoutes from "./routes/notes"
import aiRoutes from "./routes/ai"
import deepseekRoutes from "./routes/deepseekai"  // Renamed for clarity
import { connectDB } from "./db"

const app = new Hono()

connectDB()

// Logging middleware
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`)
  await next()
})

// CORS middleware
// app.use("*", cors())

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
)


// Mount route groups - CORRECT SYNTAX
app.route("/auth", authRoutes)  
app.route("/notes", noteRoutes)  
app.route("/ai", aiRoutes)      
app.route("/deepai", deepseekRoutes)  // CORRECT: Mount deepseek routes

// Add root route back
app.get("/", (c) => c.text("API is running"))
app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }))
app.get("/hh", (c) => c.text("API running"))

// 404 handler - Update availableRoutes
app.notFound((c) => {
  return c.json({ 
    error: "Route not found",
    path: c.req.path,
    method: c.req.method,
    availableRoutes: [
      "/",
      "/health", 
      "/hh",
      "/auth/register",
      "/auth/login", 
      "/auth/ping",
      "/notes",
      "/ai",
      "/deepai/summary",
      "/:id"  // Added this
    ]
  }, 404)
})

const PORT = Number(process.env.PORT) || 3001

serve({
  fetch: app.fetch,
  port: PORT,
})

console.log(`🚀 Server running on http://localhost:${PORT}`)