const fmt = n => (n == null ? '—' : Number(n).toLocaleString('pt-BR'));

async function loadSubstack() {
  let data;
  try {
    data = await fetch('data/substack.json').then(r => r.json());
  } catch (e) {
    document.getElementById('main-content').innerHTML = `
      <div class="empty-state">
        <div class="big">📩</div>
        <p>Nenhum dado Substack encontrado.<br>Atualize manualmente seus números.</p>
        <a href="substack-insights.html" style="display:inline-block;margin-top:16px;color:#7C5CBF;font-weight:600;font-size:0.82rem;">→ Atualizar dados Substack</a>
      </div>`;
    return;
  }

  const pub = data.publication;

  document.getElementById('ss-subscribers').textContent = fmt(pub.subscribers);
  document.getElementById('ss-posts').textContent = fmt(pub.posts);
  document.getElementById('ss-openrate').textContent = pub.openRate != null ? pub.openRate + '%' : '—';
  document.getElementById('ss-period').textContent = pub.period || 'Atualizar dados';

  const analEl = document.getElementById('analyst-metric');
  if (analEl) analEl.textContent = pub.openRate != null ? pub.openRate + '% open rate' : 'Sem dados ainda';

  renderPosts(data.posts || []);

  if (data.updatedAt) {
    const d = new Date(data.updatedAt);
    document.getElementById('last-updated').textContent =
      'Atualizado: ' + d.toLocaleDateString('pt-BR');
  }
}

function renderPosts(posts) {
  const container = document.getElementById('posts-list');
  if (!container) return;
  if (!posts.length) {
    container.innerHTML = `<p style="color:#9ca3af;font-size:0.82rem;text-align:center;padding:24px;">Nenhum post publicado ainda. <a href="https://karenliraadv.substack.com/publish" target="_blank" style="color:#7C5CBF;">Publicar primeira edição →</a></p>`;
    return;
  }
  container.innerHTML = posts.map(p => `
    <div class="post-row">
      <div class="post-info">
        <div class="post-title">${p.title}</div>
        <div class="post-meta">${p.date || ''} ${p.openRate ? '· ' + p.openRate + '% abertura' : ''}</div>
      </div>
      <div class="post-stats">
        <div><span class="stat-val">${fmt(p.opens)}</span><span class="stat-lbl">aberturas</span></div>
        <div><span class="stat-val">${fmt(p.clicks)}</span><span class="stat-lbl">cliques</span></div>
      </div>
    </div>`).join('');
}

loadSubstack();
