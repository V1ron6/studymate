// Proxies "explain this topic" requests to the Anthropic API.
// Keeping the API key server-side only — never expose it to the frontend.

exports.explain = async (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ message: 'A question or topic is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ message: 'AI explain is not configured on this server yet' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        messages: [
          {
            role: 'user',
            content: `You are a friendly, concise study tutor for a university student. Explain the following topic clearly, with a short example where useful:\n\n${question}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ message: 'AI service error', detail: errText });
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    res.json({ answer: text || "Sorry, I couldn't generate an explanation." });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed', error: err.message });
  }
};
