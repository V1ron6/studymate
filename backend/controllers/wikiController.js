// Research helpers: Wikipedia summaries + a free dictionary API.
// Both are public, keyless APIs — safe to call straight from the backend.

exports.searchWiki = async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.status(400).json({ message: 'A search query is required' });

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      q
    )}&format=json&srlimit=5&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const hits = (searchData.query && searchData.query.search) || [];

    if (!hits.length) {
      return res.json({ results: [] });
    }

    // Pull a short summary for the top hit so the UI has something to show immediately.
    const topTitle = hits[0].title;
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`
    );
    const summary = summaryRes.ok ? await summaryRes.json() : null;

    res.json({
      results: hits.map((h) => ({
        title: h.title,
        snippet: h.snippet.replace(/<\/?span[^>]*>/g, ''),
      })),
      top: summary
        ? {
            title: summary.title,
            extract: summary.extract,
            url: summary.content_urls && summary.content_urls.desktop.page,
            thumbnail: summary.thumbnail && summary.thumbnail.source,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Wikipedia lookup failed', error: err.message });
  }
};

exports.define = async (req, res) => {
  const { word } = req.query;
  if (!word || !word.trim()) return res.status(400).json({ message: 'A word is required' });

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
    );

    if (!response.ok) {
      return res.status(404).json({ message: `No dictionary entry found for "${word}"` });
    }

    const data = await response.json();
    const entry = data[0];
    const meanings = (entry.meanings || []).map((m) => ({
      partOfSpeech: m.partOfSpeech,
      definitions: (m.definitions || []).slice(0, 3).map((d) => d.definition),
    }));

    res.json({
      word: entry.word,
      phonetic: entry.phonetic || (entry.phonetics.find((p) => p.text) || {}).text || '',
      meanings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Dictionary lookup failed', error: err.message });
  }
};
