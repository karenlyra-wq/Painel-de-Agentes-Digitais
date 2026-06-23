const fmt = n => (n||0).toLocaleString('pt-BR');

async function loadYouTube() {
  let data;
  try {
    const res = await fetch('data/youtube.json');
    data = await res.json();
  } catch(e) {
    document.getElementById('last-updated').textContent = 'Sem dados ainda';
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><div class="big">▶</div><p>Os dados do YouTube serão carregados após a primeira execução do scraper.<br/>Vá em <strong>GitHub → Actions → Scrape YouTube → Run workflow</strong>.</p></div>';
    return;
  }

  const { myChannel, competitors, scrapedAt } = data;
  document.getElementById('last-updated').textContent = 'Atualizado: ' + new Date(scrapedAt).toLocaleString('pt-BR');

  if (!myChannel) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><div class="big">▶</div><p>Canal não encontrado. Execute o scraper em <strong>GitHub → Actions → Scrape YouTube</strong>.</p></div>';
    return;
  }

  document.getElementById('stat-subs').textContent = fmt(myChannel.subscribers);
  document.getElementById('stat-views').textContent = fmt(myChannel.totalViews);
  document.getElementById('stat-videos').textContent = fmt(myChannel.videoCount);
  const topVid = myChannel.topVideos?.[0];
  document.getElementById('stat-top').textContent = fmt(topVid?.views ?? 0);
  document.getElementById('stat-top-title').textContent = topVid ? (topVid.title||'').slice(0,38)+'…' : '—';

  const content = document.getElementById('main-content');

  // Top videos grid
  const videos = myChannel.topVideos || [];
  if (videos.length) {
    const gridHTML = videos.slice(0,6).map(v => {
      const date = v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('pt-BR') : '';
      const thumb = v.thumbnail
        ? `<img src="${v.thumbnail}" alt="" class="video-thumb"/>`
        : `<div class="video-thumb-placeholder">▶</div>`;
      return `
        <div class="video-card">
          ${thumb}
          <div class="video-body">
            <div class="video-meta">
              <span class="video-views">${fmt(v.views)} views</span>
              <span class="video-date">${date}</span>
            </div>
            <div class="video-title">${(v.title||'sem título').slice(0,80)}${(v.title||'').length>80?'…':''}</div>
            ${v.url?`<a href="${v.url}" target="_blank" rel="noopener">→ Ver no YouTube</a>`:''}
          </div>
        </div>`;
    }).join('');
    content.innerHTML += `<h2>Top ${Math.min(videos.length,6)} vídeos</h2><div class="videos-grid">${gridHTML}</div>`;
  }

  // Competitors table
  const allComp = competitors || [];
  if (allComp.length) {
    const maxSubs = Math.max(...allComp.map(c=>c.subscribers), 1);
    const rows = allComp.map(c => {
      const top = c.topVideos?.[0];
      const pct = Math.round(c.subscribers/maxSubs*100);
      return `<tr>
        <td><span class="handle">@${c.handle}</span><br/><span style="font-size:0.68rem;color:var(--muted);">${c.title||''}</span></td>
        <td>${fmt(c.subscribers)}</td>
        <td>${fmt(c.totalViews)}</td>
        <td>${fmt(c.videoCount)}</td>
        <td>${top?`<a href="${top.url}" target="_blank" style="color:var(--accent);text-decoration:none;">${fmt(top.views)}</a>`:'—'}</td>
        <td class="bar-cell"><div class="inline-bar"><div class="inline-fill" style="width:${pct}%"></div></div></td>
      </tr>`;
    }).join('');
    content.innerHTML += `
      <div class="section">
        <div class="section-title">Benchmarks — concorrentes YouTube</div>
        <table>
          <thead><tr><th>Canal</th><th>Inscritos</th><th>Views totais</th><th>Vídeos</th><th>Top vídeo</th><th class="bar-cell">Alcance relativo</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }
}

loadYouTube();