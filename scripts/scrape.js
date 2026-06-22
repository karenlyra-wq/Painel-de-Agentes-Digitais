require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const OUTPUT_FILE = path.join(__dirname, '../dashboard/data/data.json');

const MY_HANDLE = 'karenlira.adv.';
const COMPETITORS = [
  'advogadamarianagoncalves',
  '_gabriellaibrahim',
  'thaisschaly',
  'abarbaratorres',
  'millenanbg',
];

async function runScraper(usernames, label) {
  console.log(`\n→ Scraping ${label}: ${usernames.join(', ')}`);

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames,
        resultsType: 'posts',
        resultsLimit: 100,
        addParentData: true,
      }),
    }
  );

  if (!runRes.ok) {
    const err = await runRes.text();
    throw new Error(`Failed to start Apify run: ${err}`);
  }

  const { data: run } = await runRes.json();
  const runId = run.id;
  console.log(`  Run started: ${runId}`);

  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 8000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const { data: runData } = await statusRes.json();
    status = runData.status;
    process.stdout.write(`  Status: ${status}\r`);
  }

  console.log(`\n  Run finished with status: ${status}`);

  if (status !== 'SUCCEEDED') {
    throw new Error(`Apify run did not succeed. Status: ${status}`);
  }

  const datasetId = run.defaultDatasetId;
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=200&clean=true`
  );
  const items = await itemsRes.json();
  console.log(`  Fetched ${items.length} posts`);
  return items;
}

function summariseProfile(posts, handle) {
  if (!posts.length) return null;

  const sorted = [...posts].sort((a, b) => (b.videoViewCount || b.likesCount || 0) - (a.videoViewCount || a.likesCount || 0));

  const totalViews = posts.reduce((s, p) => s + (p.videoViewCount || 0), 0);
  const totalLikes = posts.reduce((s, p) => s + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.commentsCount || 0), 0);
  const followers = posts[0]?.ownerFollowersCount || null;

  return {
    handle,
    followers,
    totalPosts: posts.length,
    totalViews,
    totalLikes,
    totalComments,
    engagementRate: followers
      ? (((totalLikes + totalComments) / posts.length / followers) * 100).toFixed(2)
      : null,
    topPosts: sorted.slice(0, 10).map(p => ({
      url: p.url,
      caption: (p.caption || '').slice(0, 120),
      likes: p.likesCount,
      comments: p.commentsCount,
      views: p.videoViewCount || null,
      timestamp: p.timestamp,
      type: p.type,
    })),
  };
}

async function main() {
  if (!APIFY_TOKEN) {
    console.error('❌ APIFY_API_TOKEN not found in .env or environment');
    process.exit(1);
  }

  const myPosts = await runScraper([MY_HANDLE], 'my account');
  const myProfile = summariseProfile(myPosts, MY_HANDLE);

  console.log('\n✅ MY ACCOUNT SUMMARY');
  console.log(`  Handle:    @${myProfile.handle}`);
  console.log(`  Followers: ${myProfile.followers?.toLocaleString() ?? 'n/a'}`);
  console.log(`  Posts scraped: ${myProfile.totalPosts}`);
  console.log(`  Total views: ${myProfile.totalViews?.toLocaleString()}`);
  console.log(`  Engagement rate: ${myProfile.engagementRate}%`);
  console.log(`\n  🏆 Top post (${myProfile.topPosts[0]?.views?.toLocaleString() ?? myProfile.topPosts[0]?.likes} views/likes):`);
  console.log(`  ${myProfile.topPosts[0]?.url}`);
  console.log(`  "${myProfile.topPosts[0]?.caption}..."`);

  const compPosts = await runScraper(COMPETITORS, 'competitors');
  const competitorProfiles = COMPETITORS.map(handle => {
    const posts = compPosts.filter(p => p.ownerUsername === handle);
    return summariseProfile(posts, handle);
  }).filter(Boolean);

  console.log('\n✅ COMPETITOR SUMMARY');
  competitorProfiles.forEach(c => {
    console.log(`  @${c.handle}: ${c.followers?.toLocaleString() ?? 'n/a'} followers, top post ${c.topPosts[0]?.views ?? c.topPosts[0]?.likes} views/likes`);
  });

  const output = {
    scrapedAt: new Date().toISOString(),
    myProfile,
    competitors: competitorProfiles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n💾 Data saved to dashboard/data/data.json`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
