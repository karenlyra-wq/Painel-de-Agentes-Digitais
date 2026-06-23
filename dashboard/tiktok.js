const fmt = n => (n == null ? '—' : Number(n).toLocaleString('pt-BR'));

async function loadTikTok() {
  let data;
  try {
    data = await fetch('data/tiktok.json').then(r => r.json());
  } catch (e) {
    document.getElementById('main-content').innerHTML = `
      <div class="empty-state">
        <div class="big">🎵</div>
        <p>Nenhum dado TikTok encontrado.<br>Faça o upload do seu arquivo Overview.xlsx.</p>
        <a href="tiktok-insights.html" style="display:inline-block;margin-top:16px;color:#7C5CBF;font-weight:600;font-size:0.82rem;">→ Atualizar dados TikTok</a>
      </div>`;
    return;
  }

  const ch = data.myChannel;

  // stat cards
  document.getElementById('tk-followers').textContent = fmt(ch.followers);
  document.getElementById('tk-likes').textContent = fmt(ch.likes);
  document.getElementById('tk-videos').textContent = fmt(ch.videos);
  document.getElementById('tk-views').textContent = fmt(ch.videoViews);
  document.getElementById('tk-period').textContent = ch.period || '';

  // analyst metric
  const comp = data.competitors || [];
  const analEl = document.getElementById('analyst-metric');
  if (analEl) analEl.textContent = `${comp.length} concorrentes monitoradas`;

  // daily chart
  if (ch.daily && ch.daily.length) {
    renderDailyChart(ch.daily);
  }

  // competitors table
  renderCompetitors(comp);

  // updated timestamp
  if (data.updatedAt) {
    const d = new Date(data.updatedAt);
    document.getElementById('last-updated').textContent =
      'Atualizado: ' + d.toLocaleDateString('pt-BR');
  }
}

function renderDailyChart(daily) {
  const container = document.getElementById('daily-chart');
  if (!container) return;
  const maxViews = Math.max(...daily.map(d => d.videoViews || 0), 1);
  container.innerHTML = daily.map(d => {
    const h = Math.max(Math.round((d.videoViews / maxViews) * 80), 3);
    const label = d.date.replace('de ', '').replace(/^(\d+)\s(\w{3}).*/, '$1 $2');
    return `<div class="day-bar-wrap" title="${d.date}: ${d.videoViews} views">
      <div class="day-bar" style="height:${h}px"></div>
      <div class="day-lbl">${label.split(' ')[0]}</div>
    </div>`;
  }).join('');
}

function renderCompetitors(comp) {
  const tbody = document.getElementById('comp-tbody');
  if (!tbody) return;
  tbody.innerHTML = comp.map(c => `
    <tr>
      <td><a href="https://www.tiktok.com/@${c.handle}" target="_blank" rel="noopener">@${c.handle}</a></td>
      <td>${c.name}</td>
      <td>${fmt(c.followers)}</td>
      <td>${fmt(c.likes)}</td>
      <td style="font-size:0.72rem;color:#6b7280;">Atualizar manualmente</td>
    </tr>`).join('');
}

loadTikTok();
