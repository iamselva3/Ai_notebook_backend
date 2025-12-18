// routes/ai.ts - Use gemini-1.0-pro (has free tier)
import { Hono } from "hono"

const app = new Hono()

app.post("/summary", async (c) => {
  try {
    const { content } = await c.req.json()
    
    if (!content || content.length < 20) {
      return c.json({ error: "Content too short" }, 400)
    }
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      return c.json({ error: "Gemini API key not configured" }, 500)
    }

    console.log(`📝 Generating summary for content (${content.length} chars)`)

    // ✅ USE gemini-1.0-pro - This has free tier access
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Please provide a clear and concise summary of the following note:\n\n${content}\n\nSummary:` 
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,  // Shorter for free tier
          }
        })
      }
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)
      
      // Check if it's a quota issue
      if (response.status === 429) {
        // Parse to see which model has quota issue
        try {
          const errorData = JSON.parse(errorText)
          const message = errorData.error?.message || ""
          
          if (message.includes("gemini-2.0-flash")) {
            return c.json({ 
              error: "Please use gemini-1.0-pro model instead",
              fix: "The code has been updated to use gemini-1.0-pro which has free tier access"
            }, 400)
          }
        } catch {}
        
        return c.json({ 
          error: "Rate limit exceeded",
          message: "Please wait 60 seconds and try again"
        }, 429)
      }
      
      return c.json({ error: "AI service error" }, 500)
    }
    
    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated"
    
    console.log(`✅ Summary generated using gemini-1.0-pro (${summary.length} chars)`)
    return c.json({ 
      summary: summary.trim(),
      model: "gemini-1.0-pro",
      note: "Using free tier model"
    })
    
  } catch (err) {
    console.error("Unexpected error:", err)
    return c.json({ error: "AI service unavailable" }, 500)
  }
})

// Quick test with the correct model
app.get("/quick-test", async (c) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Say 'Hello' if you're working with free tier." }]
        }],
        generationConfig: {
          maxOutputTokens: 10
        }
      })
    }
  )
  
  if (response.ok) {
    const data = await response.json()
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    return c.json({ 
      status: "working", 
      message,
      model: "gemini-1.0-pro",
      freeTier: true
    })
  } else {
    const error = await response.text()
    return c.json({ 
      status: "error", 
      model: "gemini-1.0-pro",
      error: error.slice(0, 200) 
    }, 500)
  }
})

export default app;