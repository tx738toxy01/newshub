const fs = require('fs');
const path = require('path');

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTE-rcyZjHoG87cLwc8sWkthr2IQ99YkYo9you-YG5ZLNSyt8xtLPXs9_kkwL9NObRLnPvTxL4ckOWt/pub?output=csv';
const OUTPUT_FILE = path.join(__dirname, '..', 'feed.json');
const CONCURRENCY_LIMIT = 15;
const TIMEOUT_MS = 8500;
const MAX_ARTICLES = 10000;

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const matches = [];
        let cur = '';
        let inQuotes = false;
        for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === '"') {
                if (inQuotes && line[c + 1] === '"') {
                    cur += '"';
                    c++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                matches.push(cur.trim());
                cur = '';
            } else {
                cur += ch;
            }
        }
        matches.push(cur.trim());
        if (matches.length >= 3) {
            const id = matches[0];
            const name = matches[1];
            const url = matches[2];
            const group = matches[3] || 'Slovensko';
            const lang = matches[4] || 'sk';
            const catStr = matches[5] || '';
            const defaultCats = catStr ? catStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
            rows.push({ id, name, url, group, lang, defaultCats });
        }
    }
    return rows;
}

async function loadSourcesFromSheet() {
    try {
        const res = await fetch(SHEET_CSV_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 NewsHub/1.0' },
            signal: AbortSignal.timeout(12000)
        });
        if (res.ok) {
            const csvText = await res.text();
            const parsed = parseCSV(csvText);
            if (parsed.length > 0) return parsed;
        }
    } catch (e) {}

    try {
        if (fs.existsSync(OUTPUT_FILE)) {
            const old = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            if (Array.isArray(old.sources) && old.sources.length > 0) return old.sources;
        }
    } catch (e) {}

    return [];
}

function cleanHtml(rawHtml, sourceName = '') {
    if (!rawHtml) return '';
    let text = rawHtml
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

    if (sourceName && text.endsWith(sourceName)) {
        text = text.slice(0, -sourceName.length).replace(/[-–—|\s]+$/, '').trim();
    }
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
}

function cleanTitle(rawTitle, sourceName = '') {
    if (!rawTitle) return 'Bez názvu';
    let title = rawTitle
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

    if (sourceName) {
        const parts = title.split(/\s+[-–—|]\s+/);
        if (parts.length > 1) {
            const lastPart = parts[parts.length - 1].toLowerCase();
            const srcLower = sourceName.toLowerCase().replace(/\.(sk|cz|com|uk|org)$/i, '');
            if (lastPart.includes(srcLower) || srcLower.includes(lastPart)) {
                parts.pop();
                title = parts.join(' - ').trim();
            }
        }
    }
    return title || 'Bez názvu';
}

function extractImage(xmlItem) {
    const enclosureMatch = xmlItem.match(/<enclosure[^>]+url=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/i);
    if (enclosureMatch && enclosureMatch[1]) return enclosureMatch[1];

    const mediaMatch = xmlItem.match(/<(?:media:content|media:thumbnail)[^>]+url=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/i);
    if (mediaMatch && mediaMatch[1]) return mediaMatch[1];

    const imgMatches = xmlItem.matchAll(/<img[^>]+(?:src|data-src)=["'](https?:\/\/[^"'>\s]+)["']/gi);
    for (const m of imgMatches) {
        const u = m[1];
        if (!u.includes('googleusercontent.com/J6_coFbogxh') && !u.includes('pixel') && !u.includes('1x1') && !u.includes('tracker')) {
            return u;
        }
    }
    return '';
}

function parseFeedXml(xml, src) {
    const articles = [];
    const itemRegex = /<(?:item|entry)[\s>][\s\S]*?<\/(?:item|entry)>/gi;
    const items = xml.match(itemRegex) || [];

    for (const item of items.slice(0, 30)) {
        const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/title>/i);
        const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
        const title = cleanTitle(rawTitle, src.name);

        let link = '';
        const linkHrefMatch = item.match(/<link[^>]+href=["'](https?:\/\/[^"'\s]+)["']/i);
        if (linkHrefMatch) {
            link = linkHrefMatch[1];
        } else {
            const linkTextMatch = item.match(/<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|(https?:\/\/[^<]+))<\/link>/i);
            if (linkTextMatch) link = (linkTextMatch[1] || linkTextMatch[2] || '').trim();
        }

        if (!link || !link.startsWith('http')) {
            const guidMatch = item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i);
            if (guidMatch) link = guidMatch[1].trim();
        }

        if (!link) continue;

        const dateMatch = item.match(/<(?:pubDate|published|updated|dc:date)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\//i);
        const rawDate = dateMatch ? (dateMatch[1] || dateMatch[2] || '').trim() : '';
        const parsedDate = rawDate ? new Date(rawDate) : new Date();
        const now = Date.now();
        const safeDate = (isNaN(parsedDate.getTime()) || parsedDate.getTime() > now) ? new Date(now) : parsedDate;

        const descMatch = item.match(/<(?:description|summary|content)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\//i);
        const rawDesc = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
        const description = cleanHtml(rawDesc, src.name);

        const categoryMatches = item.matchAll(/<category[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/category>/gi);
        const categories = [];
        for (const cat of categoryMatches) {
            const val = (cat[1] || cat[2] || '').trim().toLowerCase();
            if (val) categories.push(val);
        }

        const image = extractImage(item);

        articles.push({
            sourceId: src.id,
            sourceName: src.name,
            sourceDefaultCats: src.defaultCats || [],
            title,
            link,
            pubDate: safeDate.toISOString(),
            description: description === title ? '' : description,
            categories,
            image: image.includes('unsplash.com') ? '' : image
        });
    }

    return articles;
}

async function fetchSource(src) {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
    let content = '';
    let isJson = false;

    try {
        const res = await fetch(src.url, {
            headers: { 'User-Agent': userAgent, 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
            signal: AbortSignal.timeout(TIMEOUT_MS)
        });
        if (res.ok) {
            content = await res.text();
        }
    } catch (e) {}

    if (!content || content.includes('Just a moment...') || content.includes('cloudflare')) {
        try {
            const proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(src.url);
            const resProxy = await fetch(proxyUrl, {
                headers: { 'User-Agent': userAgent },
                signal: AbortSignal.timeout(TIMEOUT_MS)
            });
            if (resProxy.ok) {
                content = await resProxy.text();
                isJson = true;
            }
        } catch (e) {}
    }

    if (!content) return [];
    
    if (isJson || content.trim().startsWith('{')) {
        try {
            const data = JSON.parse(content);
            if (data.status !== 'ok' || !data.items) return [];
            
            return data.items.slice(0, 30).map(item => {
                const title = cleanTitle(item.title, src.name);
                const desc = cleanHtml(item.description || item.content || '', src.name);
                const safeDate = new Date(item.pubDate);
                let image = item.thumbnail || extractImage(item.content || item.description || '');
                
                return {
                    sourceId: src.id,
                    sourceName: src.name,
                    sourceDefaultCats: src.defaultCats || [],
                    title: title,
                    link: item.link,
                    pubDate: (isNaN(safeDate.getTime()) ? new Date() : safeDate).toISOString(),
                    description: desc === title ? '' : desc,
                    categories: Array.isArray(item.categories) ? item.categories.map(c => c.toLowerCase()) : [],
                    image: image.includes('unsplash.com') ? '' : image
                };
            });
        } catch(e) {
            return [];
        }
    }
    
    return parseFeedXml(content, src);
}

async function runPool(items, limit, fn) {
    const results = [];
    const executing = new Set();
    for (const item of items) {
        const p = fn(item).then(res => {
            executing.delete(p);
            return res;
        });
        results.push(p);
        executing.add(p);
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

async function main() {
    const sources = await loadSourcesFromSheet();
    if (sources.length === 0) {
        process.exit(1);
    }

    const oldDates = new Map();
    try {
        if (fs.existsSync(OUTPUT_FILE)) {
            const old = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            if (Array.isArray(old.articles)) {
                old.articles.forEach(a => {
                    const cUrl = a.link.split('#')[0].replace(/\/+$/, '');
                    oldDates.set(cUrl, a.pubDate);
                });
            }
        }
    } catch(e) {}

    const feedResults = await runPool(sources, CONCURRENCY_LIMIT, fetchSource);
    const seenLinks = new Set();
    const allArticles = [];

    for (const batch of feedResults) {
        for (const a of batch) {
            const cleanUrl = a.link.split('#')[0].replace(/\/+$/, '');
            if (!seenLinks.has(cleanUrl)) {
                seenLinks.add(cleanUrl);
                
                if (oldDates.has(cleanUrl)) {
                    const oldTime = new Date(oldDates.get(cleanUrl)).getTime();
                    const newTime = new Date(a.pubDate).getTime();
                    if (oldTime < newTime) {
                        a.pubDate = new Date(oldTime).toISOString();
                    }
                }
                
                allArticles.push(a);
            }
        }
    }

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const finalArticles = allArticles.slice(0, MAX_ARTICLES);

    const outputData = {
        updatedAt: Date.now(),
        count: finalArticles.length,
        sources: sources,
        articles: finalArticles
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData), 'utf-8');
}

main();
