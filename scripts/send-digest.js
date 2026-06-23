const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'karenlyra@live.com';
const FROM_EMAIL = 'onboarding@resend.dev';
const DATA_FILE = path.join(__dirname, '../dashboard/data/data.json');

function fmt(n) {
  return (n || 0).toLocaleString('pt-BR');
}

function buildEmail(data) {
  const { myProfile, competitors, scrapedAt } = data;
  const date = new Date(scrapedAt).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const topPost = myProfile.topPosts[0];
  const topPostMetric = topPost?.views ?? topPost?.likes ?? 0;
  const topPostCaption = (topPost?.caption || 'sem legenda').slice(0, 80);
  const engRate = myProfile.engagementRate ?? '—';

  const topComp = [...competitors].sort((a, b) => b.totalViews - a.totalViews)[0];
  const ratio = topComp && myProfile.totalViews > 0
    ? Math.round(topComp.totalViews / myProfile.totalViews)
    : '∞';

  const compRows = competitors.map(c => {
    const top = c.topPosts[0];
    const topV = top?.views ?? top?.likes ?? 0;
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#7C5CBF;">@${c.handle}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${fmt(c.totalViews)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${fmt(topV)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${c.totalPosts}</td>
      </tr>`;
  }).join('');

  const ideias = [
    '"3 erros que fazem seu contrato de imóvel ser anulado" — Reels 60s',
    '"O que é mediação e por que evita meses de processo" — Carrossel',
    '"Planejamento patrimonial: o que está faltando no seu" — Reels',
    '"Inventário extrajudicial vs judicial — qual escolher" — Vídeo',
    '"Due diligence imobiliária: o checklist completo" — Carrossel',
  ].map(i => `<li style="margin-bottom:8px;">${i}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7fc;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
    <div style="background:#7C5CBF;border-radius:14px;padding:28px 32px;margin-bottom:20px;">
      <div style="color:#e8e0ff;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Digest Semanal</div>
      <div style="color:white;font-size:1.4rem;font-weight:700;">Painel de Agentes</div>
      <div style="color:#d4c8f5;font-size:0.82rem;margin-top:4px;">@karenlira.adv · ${date}</div>
    </div>
    <div style="background:white;border-radius:14px;padding:24px;margin-bottom:16px;box-shadow:0 2px 12px rgba(124,92,191,0.08);">
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.8px;color:#6b7280;margin-bottom:16px;">Seus números</div>
      <table style="width:100%;text-align:center;">
        <tr>
          <td><div style="font-size:1.5rem;font-weight:700;color:#1a1a2e;">${myProfile.followers ?? 828}</div><div style="font-size:0.68rem;color:#6b7280;">Seguidores</div></td>
          <td><div style="font-size:1.5rem;font-weight:700;color:#1a1a2e;">${myProfile.totalPosts}</div><div style="font-size:0.68rem;color:#6b7280;">Posts</div></td>
          <td><div style="font-size:1.5rem;font-weight:700;color:#1a1a2e;">${fmt(myProfile.totalViews)}</div><div style="font-size:0.68rem;color:#6b7280;">Views totais</div></td>
          <td><div style="font-size:1.5rem;font-weight:700;color:#1a1a2e;">${engRate}%</div><div style="font-size:0.68rem;color:#6b7280;">Engajamento</div></td>
        </tr>
      </table>
      <div style="margin-top:16px;padding:12px;background:#f0ebfa;border-radius:10px;font-size:0.8rem;">
        <span style="font-weight:700;color:#7C5CBF;">🏆 Top post:</span>
        <span style="color:#1a1a2e;"> ${fmt(topPostMetric)} views/likes — "${topPostCaption}…"</span>
        ${topPost?.url ? `<br/><a href="${topPost.url}" style="color:#7C5CBF;font-size:0.72rem;">→ Ver no Instagram</a>` : ''}
      </div>
    </div>
    <div style="background:white;border-radius:14px;padding:24px;margin-bottom:16px;box-shadow:0 2px 12px rgba(124,92,191,0.08);">
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.8px;color:#6b7280;margin-bottom:12px;">📊 Analista — Benchmark</div>
      <p style="font-size:0.85rem;color:#1a1a2e;margin:0 0 16px;">
        <strong>@${topComp?.handle}</strong> lidera com <strong>${fmt(topComp?.totalViews)} views</strong> —
        isso é <strong>${ratio}x mais</strong> que o seu volume atual.
        Formato que mais performa esta semana: <strong>Reels curtos com gancho opinativo</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
        <thead>
          <tr style="background:#f8f7fc;">
            <th style="text-align:left;padding:8px 12px;font-size:0.68rem;color:#6b7280;text-transform:uppercase;">Perfil</th>
            <th style="text-align:left;padding:8px 12px;font-size:0.68rem;color:#6b7280;text-transform:uppercase;">Views totais</th>
            <th style="text-align:left;padding:8px 12px;font-size:0.68rem;color:#6b7280;text-transform:uppercase;">Top post</th>
            <th style="text-align:left;padding:8px 12px;font-size:0.68rem;color:#6b7280;text-transform:uppercase;">Posts</th>
          </tr>
        </thead>
        <tbody>${compRows}</tbody>
      </table>
    </div>
    <div style="background:white;border-radius:14px;padding:24px;margin-bottom:16px;box-shadow:0 2px 12px rgba(124,92,191,0.08);">
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.8px;color:#6b7280;margin-bottom:12px;">💡 Ideador — 5 ideias desta semana</div>
      <ul style="margin:0;padding-left:18px;font-size:0.82rem;color:#1a1a2e;line-height:1.8;">${ideias}</ul>
    </div>
    <div style="text-align:center;padding:20px;">
      <a href="https://karenlyra-wq.github.io/Painel-de-Agentes-Digitais/dashboard/"
         style="background:#7C5CBF;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:0.85rem;font-weight:600;">
        → Abrir painel completo
      </a>
    </div>
    <div style="text-align:center;font-size:0.68rem;color:#9ca3af;padding-bottom:24px;">
      Gerado automaticamente pelo seu Painel de Agentes · toda sexta às 8h
    </div>
  </div>
</body>
</html>`;

  const text = `DIGEST SEMANAL — @karenlira.adv\n${date}\n\nSeguidores: ${myProfile.followers ?? 828}\nPosts: ${myProfile.totalPosts}\nViews totais: ${fmt(myProfile.totalViews)}\nEngajamento: ${engRate}%\nTop post: ${fmt(topPostMetric)} views — "${topPostCaption}"\n${topPost?.url || ''}\n\nBENCHMARK\n${topComp?.handle} lidera com ${fmt(topComp?.totalViews)} views (${ratio}x o seu volume)\n\n5 IDEIAS\n1. "3 erros que fazem seu contrato de imóvel ser anulado"\n2. "O que é mediação e por que evita meses de processo"\n3. "Planejamento patrimonial: o que está faltando no seu"\n4. "Inventário extrajudicial vs judicial — qual escolher"\n5. "Due diligence imobiliária: o checklist completo"\n\nPainel: https://karenlyra-wq.github.io/Painel-de-Agentes-Digitais/dashboard/`;

  return { html, text };
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not set');
    process.exit(1);
  }
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ data.json not found — run scrape.js first');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const { html, text } = buildEmail(data);

  console.log('→ Sending digest email...');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `📊 Digest Semanal — @karenlira.adv · ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`,
      html,
      text,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('❌ Resend error:', JSON.stringify(result));
    process.exit(1);
  }

  console.log('✅ Email sent! ID:', result.id);
  console.log(`   To: ${TO_EMAIL}`);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
