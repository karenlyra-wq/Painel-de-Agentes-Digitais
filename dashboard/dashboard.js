const COLORS = {
  accent: '#7C5CBF',
  accent2: '#B89EE0',
  muted: '#e5e7eb',
  green: '#22c55e',
  orange: '#f97316',
  blue: '#3b82f6',
  pink: '#ec4899',
};

function donutChart(el, pct1, label1, pct2, label2, color1, color2) {
  el.style.background = `conic-gradient(${color1} 0% ${pct1}%, ${color2} ${pct1}% 100%)`;
  el.style.borderRadius = '50%';
  const legend = el.nextElementSibling;
  legend.innerHTML = `
    <div class="legend-item"><div class="legend-dot" style="background:${color1}"></div><span>${label1}: <strong>${pct1}%</strong></span></div>
    <div class="legend-item"><div class="legend-dot" style="background:${color2}"></div><span>${label2}: <strong>${pct2}%</strong></span></div>
  `;
}

function barChart(containerId, data, maxVal) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const max = maxVal || Math.max(...Object.values(data));
  Object.entries(data).forEach(([label, val]) => {
    const pct = max > 0 ? Math.round((val / max) * 100) : 0;
    el.innerHTML += `
      <div class="bar-item">
        <div class="bar-label"><span>${label}</span><span>${val}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  });
}

async function loadData() {
  let data, insights;
  try { const r = await fetch('data/data.json'); data = await r.json(); }
  catch(e) { document.getElementById('last-updated').textContent = 'Erro ao carregar data.json'; return; }
  try { const r = await fetch('data/insights.json'); insights = await r.json(); }
  catch(e) { insights = null; }

  const { myProfile, competitors, scrapedAt } = data;
  document.getElementById('last-updated').textContent = 'Atualizado: ' + new Date(scrapedAt).toLocaleString('pt-BR');

  // Stats
  const followers = insights?.followers ?? myProfile.followers ?? 828;
  document.getElementById('stat-followers').textContent = followers.toLocaleString('pt-BR');
  document.getElementById('stat-posts').textContent = myProfile.totalPosts.toLocaleString('pt-BR');
  document.getElementById('stat-views').textContent = (insights?.impressions ?? myProfile.totalViews).toLocaleString('pt-BR');
  document.getElementById('stat-views-label').textContent = insights ? 'visualizações (30 dias)' : 'views em vídeos';
  document.getElementById('stat-likes').textContent = myProfile.totalLikes.toLocaleString('pt-BR');
  document.getElementById('stat-comments').textContent = myProfile.totalComments.toLocaleString('pt-BR');
  const topPost = myProfile.topPosts[0];
  if (topPost) {
    document.getElementById('stat-top').textContent = (topPost.views ?? topPost.likes ?? 0).toLocaleString('pt-BR');
    document.getElementById('stat-top-caption').textContent = (topPost.caption || 'sem legenda').slice(0, 40) + '…';
  }

  // Insights section
  if (insights) {
    document.getElementById('insights-section').classList.add('visible');
    if (insights.week) {
      const d = new Date(insights.week + 'T12:00:00');
      document.getElementById('ins-week-label').textContent =
        '— semana de ' + d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    }
    document.getElementById('ins-reach').textContent = insights.reach.toLocaleString('pt-BR');
    document.getElementById('ins-interactions').textContent = insights.interactions.toLocaleString('pt-BR');
    document.getElementById('ins-engaged').textContent = insights.accountsEngaged?.toLocaleString('pt-BR') ?? '—';
    document.getElementById('ins-saves').textContent = insights.saves != null ? insights.saves.toLocaleString('pt-BR') : '—';
    document.getElementById('ins-profile').textContent = insights.profileVisits.toLocaleString('pt-BR');
    document.getElementById('ins-links').textContent = insights.externalLinkTaps ?? '—';

    // Chart 1: views by audience
    const va = insights.viewsByAudience;
    if (va) donutChart(
      document.getElementById('donut-views-audience'),
      va.seguidores, 'Seguidores', va.naoSeguidores, 'Não seguidores',
      COLORS.accent, COLORS.accent2
    );

    // Chart 2: views by content type
    if (insights.viewsByContent) barChart('bars-views-content', insights.viewsByContent, 100);

    // Chart 3: interactions by audience
    const ia = insights.interactionsByAudience;
    if (ia) donutChart(
      document.getElementById('donut-int-audience'),
      ia.seguidores, 'Seguidores', ia.naoSeguidores, 'Não seguidores',
      COLORS.green, COLORS.muted
    );

    // Chart 4: interactions by content type
    if (insights.interactionsByContent) barChart('bars-int-content', insights.interactionsByContent, 100);
  }

  // Analyst metric
  const allComp = competitors || [];
  const topComp = [...allComp].sort((a,b) => b.totalViews - a.totalViews)[0];
  if (topComp) {
    const ratio = Math.round(topComp.totalViews / Math.max(myProfile.totalViews, 1));
    document.getElementById('analyst-metric').textContent = `@${topComp.handle} tem ${ratio}x mais views`;
  }
  document.getElementById('ideator-metric').textContent = `${allComp.length} concorrentes analisados`;

  // Top posts
  const grid = document.getElementById('posts-grid');
  myProfile.topPosts.slice(0,6).forEach(post => {
    const val = post.views != null ? post.views : post.likes;
    const lbl = post.views != null ? 'views' : 'likes';
    const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString('pt-BR') : '';
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `<div class="post-meta"><span class="views">${(val||0).toLocaleString('pt-BR')} ${lbl}</span><span class="date">${date}</span></div><div class="caption">${(post.caption||'sem legenda').slice(0,90)}…</div>${post.url?`<a href="${post.url}" target="_blank" rel="noopener">→ Ver no Instagram</a>`:''}`;
    grid.appendChild(card);
  });

  // Competitors
  const tbody = document.getElementById('competitors-tbody');
  const maxV = Math.max(...allComp.map(c=>c.totalViews),1);
  allComp.forEach(c => {
    const top = c.topPosts[0];
    const tv = top?.views ?? top?.likes ?? 0;
    const pct = Math.round(c.totalViews/maxV*100);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><span class="handle">@${c.handle}</span></td><td>${c.totalPosts}</td><td>${c.totalViews.toLocaleString('pt-BR')}</td><td>${c.totalLikes.toLocaleString('pt-BR')}</td><td><a href="${top?.url||'#'}" target="_blank" style="color:var(--accent);text-decoration:none;">${tv.toLocaleString('pt-BR')}</a></td><td class="bar-cell"><div class="inline-bar"><div class="inline-fill" style="width:${pct}%"></div></div></td>`;
    tbody.appendChild(tr);
  });

  if (AGENT_MODALS?.analyst) {
    AGENT_MODALS.analyst.list = allComp.map(c => {
      const top = c.topPosts[0];
      return `@${c.handle}: ${c.totalViews.toLocaleString('pt-BR')} views totais | top: ${(top?.views??top?.likes??0).toLocaleString('pt-BR')}`;
    });
  }
}

window.openModal = function(id) {
  const map = {
    'stat-followers': { title: 'Seguidores', body: 'Total de seguidores conforme Instagram Insights. Atualizado semanalmente.' },
    'stat-posts':     { title: 'Posts publicados', body: 'Total de posts coletados pelo scraper no seu perfil @karenlira.adv.' },
    'stat-views':     { title: 'Visualizações', body: 'Total de visualizações nos últimos 30 dias (Instagram Insights).' },
    'stat-likes':     { title: 'Likes e comentários', body: 'Total de interações nos seus posts históricos.' },
    'stat-top':       { title: 'Top post', body: 'Post com mais views ou likes no histórico coletado.' },
  };
  const m = map[id]; if (!m) return;
  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-body').textContent = m.body;
  document.getElementById('modal-list').innerHTML = '';
  document.getElementById('modal-overlay').classList.add('open');
};

loadData();
