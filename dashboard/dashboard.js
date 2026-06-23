async function loadData() {
  let data;
  try {
    const res = await fetch('data/data.json');
    data = await res.json();
  } catch (e) {
    document.getElementById('last-updated').textContent = 'Erro ao carregar data.json';
    return;
  }

  const { myProfile, competitors, scrapedAt } = data;

  document.getElementById('last-updated').textContent =
    'Atualizado: ' + new Date(scrapedAt).toLocaleString('pt-BR');

  document.getElementById('stat-posts').textContent = myProfile.totalPosts.toLocaleString('pt-BR');
  document.getElementById('stat-views').textContent = myProfile.totalViews.toLocaleString('pt-BR');
  document.getElementById('stat-likes').textContent = myProfile.totalLikes.toLocaleString('pt-BR');
  document.getElementById('stat-comments').textContent = myProfile.totalComments.toLocaleString('pt-BR');

  const topPost = myProfile.topPosts[0];
  if (topPost) {
    const topVal = topPost.views ?? topPost.likes ?? 0;
    document.getElementById('stat-top').textContent = topVal.toLocaleString('pt-BR');
    document.getElementById('stat-top-caption').textContent =
      (topPost.caption || 'sem legenda').slice(0, 40) + '…';
  }

  const allComp = competitors || [];
  const topComp = [...allComp].sort((a, b) => b.totalViews - a.totalViews)[0];
  if (topComp) {
    const ratio = topComp.totalViews > 0
      ? Math.round(topComp.totalViews / Math.max(myProfile.totalViews, 1))
      : '∞';
    document.getElementById('analyst-metric').textContent =
      `@${topComp.handle} tem ${ratio}x mais views`;
  }

  document.getElementById('ideator-metric').textContent =
    `${allComp.length} concorrentes analisados`;

  const grid = document.getElementById('posts-grid');
  const top6 = myProfile.topPosts.slice(0, 6);
  top6.forEach(post => {
    const metricVal = post.views != null ? post.views : post.likes;
    const metricLabel = post.views != null ? 'views' : 'likes';
    const dateStr = post.timestamp
      ? new Date(post.timestamp).toLocaleDateString('pt-BR')
      : '';
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-meta">
        <span class="views">${(metricVal || 0).toLocaleString('pt-BR')} ${metricLabel}</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="caption">${(post.caption || 'sem legenda').slice(0, 90)}${post.caption && post.caption.length > 90 ? '…' : ''}</div>
      ${post.url ? `<a href="${post.url}" target="_blank" rel="noopener">→ Ver no Instagram</a>` : ''}
    `;
    grid.appendChild(card);
  });

  const tbody = document.getElementById('competitors-tbody');
  const maxViews = Math.max(...allComp.map(c => c.totalViews), 1);
  allComp.forEach(c => {
    const topP = c.topPosts[0];
    const topViews = topP?.views ?? topP?.likes ?? 0;
    const pct = Math.round((c.totalViews / maxViews) * 100);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="handle">@${c.handle}</span></td>
      <td>${c.totalPosts}</td>
      <td>${c.totalViews.toLocaleString('pt-BR')}</td>
      <td>${c.totalLikes.toLocaleString('pt-BR')}</td>
      <td><a href="${topP?.url || '#'}" target="_blank" style="color:var(--accent);text-decoration:none;">${topViews.toLocaleString('pt-BR')}</a></td>
      <td class="bar-cell">
        <div class="inline-bar"><div class="inline-fill" style="width:${pct}%"></div></div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (AGENT_MODALS && AGENT_MODALS.analyst) {
    AGENT_MODALS.analyst.list = allComp.map(c => {
      const topP = c.topPosts[0];
      return `@${c.handle}: ${c.totalViews.toLocaleString('pt-BR')} views totais | top post: ${(topP?.views ?? topP?.likes ?? 0).toLocaleString('pt-BR')} views`;
    });
  }
}

window.openModal = function(id) {
  const modals = {
    'stat-posts': { title: 'Posts publicados', body: 'Total de posts coletados pelo scraper no seu perfil @karenlira.adv. O scraper coleta até 100 posts por execução.' },
    'stat-views': { title: 'Total de views', body: 'Soma de todas as visualizações em vídeos. Posts de Imagem e Carrossel não contabilizam views.' },
    'stat-likes': { title: 'Likes e comentários', body: 'Total de interações. Muitos comentários = audiência mais engajada.' },
    'stat-top': { title: 'Seu post de maior alcance', body: 'Post com mais views ou likes no seu histórico. Analise o formato, legenda e horário para replicar.' }
  };
  const m = modals[id];
  if (!m) return;
  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-body').textContent = m.body;
  document.getElementById('modal-list').innerHTML = '';
  document.getElementById('modal-overlay').classList.add('open');
};

loadData();
