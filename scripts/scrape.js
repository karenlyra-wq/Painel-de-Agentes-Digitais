const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const OUTPUT_FILE = path.join(__dirname, '../dashboard/data/data.json');

const MY_HANDLE = 'karenlira.adv';
const COMPETITORS = [
  'advogadamarianagoncalves',
  '_gabriellaibrahim',
  'thaisschaly',
  'abarbaratorres',
  'millenanbg',
];

function toUrl(handle) {
  return `https://www.instagram.com/${handle}/`;
}

async function runScraper(handles, label) {
  console.log(`\n→ Scraping ${label}: ${handles.join(', ')}`);

  const directUrls = handles.map(toUrl);

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        directUrls,
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
  const datasetId = run.defaultDatasetId;
  console.log(`  Run ID: ${runId}`);

  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 10000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const { data: runData } = await statusRes.json();
    status = runData.status;
    process.stdout.write(`  Status: ${status}\r`);
  }

  console.log(`\n  Run finished: ${status}`);

  if (status !== 'SUCCEEDED') {
    throw new Error(`Apify run did not succeed. Status: ${status}`);
  }

  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=500&clean=true`
  );
  const items = await itemsRes.json();
  console.log(`  Fetched ${items.length} items`);
  return items;
}

function summariseProfile(posts, handle) {
  if (!posts || !posts.length) {
    console.warn(`  ⚠️  No posts found for @${handle}`);
    return { handle, followers: null, totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0, engagementRate: null, topPosts: [] };
  }

  const sorted = [...posts].sort(
    (a, b) => (b.videoViewCount || b.likesCount || 0) - (a.videoViewCount || a.likesCount || 0)
  );

  const totalViews    = posts.reduce((s, p) => s + (p.videoViewCount || 0), 0);
  const totalLikes    = posts.reduce((s, p) => s + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.commentsCount || 0), 0);

  const followers =
    posts[0]?.ownerFollowersCount ||
    posts[0]?.owner?.followersCount ||
    null;

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
      caption: (p.caption || '').slice(0, 150),
      likes: p.likesCount || 0,
      comments: p.commentsCount || 0,
      views: p.videoViewCount || null,
      timestamp: p.timestamp,
      type: p.type,
    })),
  };
}

async function main() {
  if (!APIFY_TOKEN) {
    console.error('❌ APIFY_API_TOKEN not set');
    process.exit(1);
  }

  const myPosts = await runScraper([MY_HANDLE], 'my account');
  const myProfile = summariseProfile(myPosts, MY_HANDLE);

  console.log('\n✅ MY ACCOUNT');
  console.log(`  @${myProfile.handle}`);
  console.log(`  Followers:     ${myProfile.followers?.toLocaleString() ?? 'n/a'}`);
  console.log(`  Posts scraped: ${myProfile.totalPosts}`);
  console.log(`  Total views:   ${myProfile.totalViews.toLocaleString()}`);
  console.log(`  Total likes:   ${myProfile.totalLikes.toLocaleString()}`);
  console.log(`  Engagement:    ${myProfile.engagementRate ?? 'n/a'}%`);
  if (myProfile.topPosts[0]) {
    const top = myProfile.topPosts[0];
    console.log(`  🏆 Top post: ${top.views?.toLocaleString() ?? top.likes} views/likes`);
    console.log(`     ${top.url}`);
    console.log(`     "${top.caption}"`);
  }

  const compPosts = await runScraper(COMPETITORS, 'competitors');

  const competitorProfiles = COMPETITORS.map(handle => {
    const posts = compPosts.filter(
      p =>
        (p.ownerUsername || '').toLowerCase() === handle.toLowerCase() ||
        (p.url || '').includes(`/${handle}/`)
    );
    return summariseProfile(posts, handle);
  });

  console.log('\n✅ COMPETITORS');
  competitorProfiles.forEach(c => {
    const top = c.topPosts[0];
    console.log(
      `  @${c.handle}: ${c.followers?.toLocaleString() ?? 'n/a'} followers | ` +
      `top post ${top?.views?.toLocaleString() ?? top?.likes ?? 0} views/likes`
    );
  });

  const output = {
    scrapedAt: new Date().toISOString(),
    myProfile,
    competitors: competitorProfiles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved → dashboard/data/data.json`);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
