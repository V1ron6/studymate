// General "search the web" helper. DuckDuckGo's Instant Answer API is free
// and keyless, so it's the safest default here — it returns a summary plus
// related topics rather than full ranked web results.

exports.webSearch = async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.status(400).json({ message: 'A search query is required' });

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url);
    const data = await response.json();

    const related = (data.RelatedTopics || [])
      .filter((t) => t.Text)
      .slice(0, 6)
      .map((t) => ({ text: t.Text, url: t.FirstURL }));

    res.json({
      heading: data.Heading || '',
      abstract: data.AbstractText || '',
      abstractUrl: data.AbstractURL || '',
      source: data.AbstractSource || '',
      related,
    });
  } catch (err) {
    res.status(500).json({ message: 'Web search failed', error: err.message });
  }
};
