// routes/openrouter.ts
import { Hono } from "hono"

const app = new Hono()

app.post("/summary", async (c) => {
  try {
    const { content } = await c.req.json()

    if (!content || content.length < 20) {
      return c.json({ error: "Content too short" }, 400)
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Notes Summary App",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "Summarize clearly and concisely." },
          { role: "user", content }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error(err)
      return c.json({ error: "AI failed" }, 500)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content

    return c.json({
      summary: summary?.trim(),
      model: "mistral-7b-instruct",
      provider: "openrouter",
    })
  } catch (e) {
    console.error(e)
    return c.json({ error: "Unexpected error" }, 500)
  }
})

export default app
