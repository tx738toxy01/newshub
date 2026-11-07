const fs = require('fs');
const path = require('path');

const SOURCES = [
  { id: 'aktuality', name: 'Aktuality.sk', lang: 'sk', cat: 'domace', url: 'https://www.aktuality.sk/rss/' },
  { id: 'dennikn', name: 'Denník N', lang: 'sk', cat: 'domace', url: 'https://dennikn.sk/feed/' },
  { id: 'sme', name: 'SME', lang: 'sk', cat: 'domace', url: 'https://rss.sme.sk/rss/rss.asp?sek=smeonline' },
  { id: 'ct24', name: 'ČT24', lang: 'cz', cat: 'zahranicne', url: 'https://ct24.ceskatelevize.cz/rss/hlavni-zpravy' },
  { id: 'bbc', name: 'BBC World', lang: 'en', cat: 'zahranicne', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' }
];

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
             || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractImage(itemXml) {
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (encMatch) return encMatch[1];

  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) return mediaMatch[1];

  const imgTagMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgTagMatch) return imgTagMatch[1];

  return '';
}

function cleanHtml(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
}

async function fetchFeed(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (NewsHub Aggregator/1.0)' }
    });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const xml = await res.text();
    const items = [];
    const itemRegex = /<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const itemXml = match[0];
      const title = cleanHtml(extractTag(itemXml, 'title'));
      const linkMatch = itemXml.match(/<link[^>]*href=["']([^"']+)["']/i) || itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const link = linkMatch ? (linkMatch[1] || '').trim() : '';
      const dateStr = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published') || extractTag(itemXml, 'updated');
      const desc = cleanHtml(extractTag(itemXml, 'description') || extractTag(itemXml, 'summary'));
      const image = extractImage(itemXml);

      if (title && link) {
        items.push({
          title,
          link,
          description: desc.slice(0, 220),
          image,
          sourceId: source.id,
          sourceName: source.name,
          category: source.cat,
          lang: source.lang,
          pubDate: dateStr ? new Date(dateStr).getTime() : Date.now()
        });
      }
    }
    return items;
  } catch (err) {
    return [];
  }
}

async function run() {
  const BATCH_SIZE = 20;
  let allArticles = [];

  for (let i = 0; i < SOURCES.length; i += BATCH_SIZE) {
    const batch = SOURCES.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchFeed));
    results.forEach(items => allArticles.push(...items));
  }

  allArticles = allArticles
    .filter(a => !isNaN(a.pubDate))
    .sort((a, b) => b.pubDate - a.pubDate)
    .slice(0, 400);

  const payload = {
    updatedAt: Date.now(),
    count: allArticles.length,
    articles: allArticles
  };

  const outputPath = path.join(__dirname, '..', 'feed.json');
  fs.writeFileSync(outputPath, JSON.stringify(payload));
}

run();
