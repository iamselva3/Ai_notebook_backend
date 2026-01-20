export const summarizeNote = async (req, res) => {
    try {
        const { content } = req.body;

        console.log("Summarization request received");

        if (!content || content.length < 20) {
            return res.status(400).json({ error: "Content too short" });
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
                    { role: "user", content },
                ],
                temperature: 0.3,
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("AI error:", err);
            return res.status(500).json({ error: "AI failed" });
        }

        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content?.trim();

        return res.json({
            summary,
            model: "mistral-7b-instruct",
            provider: "openrouter",
        });
    } catch (error) {
        console.error("Unexpected AI error:", error);
        return res.status(500).json({ error: "Unexpected error" });
    }
};
