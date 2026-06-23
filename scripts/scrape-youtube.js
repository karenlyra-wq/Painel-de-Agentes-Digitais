require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.YOUTUBE_API_KEY;
const OUTPUT = path.join(__dirname, '../dashboard/data/youtube.json');

const MY_HANDLE = 'kah_lira';
const COMPETITOR_HANDLES = ['abarbaratorres', 'nischa', 'barbaraferreira.a', '_jared'];

async function yt(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  url.searchParams.set('key', API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const body = await res.json();
  if (!res.ok) throw new Error(`YT API ${res.status}: ${body.error?.message || JSON.stringify(body)}`);
  return body;
}

async function getChannelByHandle(handle) {
  try {
    const data = await yt('channels', {
      part: 'snippet,statistics,contentDetails',
      forHandle: handle,
    });
    if (data.items?.length) return data.items[0];
  } catch(e) { console.warn(`  forHandle failed for ${handle}: ${e.message}`); }

  const search = await yt('search', {
    part: 'snippet',
    q: handle,
    type: 'channel',
    maxResults: 1,
  });
  if (!search.items?.length) return null;
  const channelId = search.items[0].snippet.channelId;
  const data = await yt('channels', {
    part: 'snippet,statistics,contentDetails',
    id: channelId,
  });
  return data.items?.[0] || null;
}

async function getTopVideos(uploadsPlaylistId, maxResults = 10) {
  const playlist = await yt('playlistItems', {
    part: 'contentDetails',
    playlistId: uploadsPlaylistId,
    maxResults,
  });
  const ids = (playlist.items || []).map(i => i.contentDetails.videoId).join(',');
  if (!ids) return [];
  const videos = await yt('videos', { part: 'snippet,statistics', id: ids });
  return (videos.items || [])
    .map(v => ({
      id: v.id,
      title: v.snippet.title,
      views: parseInt(v.statistics.viewCount || 0),
      likes: parseInt(v.statistics.likeCount || 0),
      comments: parseInt(v.statistics.commentCount || 0),
      url: `https://youtube.com/watch?v=${v.id}`,
      publishedAt: v.snippet.publishedAt,
      thumbnail: v.snippet.thumbnails?.medium?.url || '',
    }))
    .sort((a, b) => b.views - a.views);
}

async function scrapeChannel(handle) {
  console.log(`  → @${handle}...`);
  const ch = await getChannelByHandle(handle);
  if (!ch) { console.warn(`  ⚠ Not found: @${handle}`); return null; }
  const uploadsId = ch.contentDetails.relatedPlaylists.uploads;
  const topVideos = await getTopVideos(uploadsId, 10);
  return {
    handle,
    channelId: ch.id,
    title: ch.snippet.title,
    subscribers: parseInt(ch.statistics.subscriberCount || 0),
    totalViews: parseInt(ch.statistics.viewCount || 0),
    videoCount: parseInt(ch.statistics.videoCount || 0),
    topVideos,
  };
}

async function main() {
  if (!API_KEY) { console.error('❌ YOUTUBE_API_KEY not set'); process.exit(1); }
  console.log('→ Scraping YouTube channel...');
  const myChannel = await scrapeChannel(MY_HANDLE);
  console.log('→ Scraping competitors...');
  const competitors = [];
  for (const h of COMPETITOR_HANDLES) {
    const ch = await scrapeChannel(h);
    if (ch) competitors.push(ch);
  }
  const result = { myChannel, competitors, scrapedAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
  console.log(`✅ Saved to ${OUTPUT}`);
  if (myChannel) console.log(`   ${myChannel.title} · ${myChannel.subscribers.toLocaleString()} inscritos · ${myChannel.videoCount} vídeos`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });