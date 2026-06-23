/**
 * Pautas do Dia — busca as top notícias do Brasil via RSS,
 * gera ângulos jurídico/filosófico/formato com Gemini (gratuito) e envia por email.
 */

const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL          = 'karenlyra@live.com';
const FROM_EMAIL        = process.env.FROM_EMAIL || 'onboarding@resend.dev';

const RSS_FEEDS = [
  { name: 'G1',   url: 'https://g1.globo.com/rss/g1/' },
  { name: 'UOL',  url: 'https://rss.uol.com.br/feed/noticias.xml' },
  { name: 'Folha', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml' },
];

// ── RSS ─────────────────────────────────────────────────────────────────────

function parseItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const block of itemBlocks) {
    const title = (block.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                   block.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1];
    const link  = (block.match(/<link[^>]*>(https?:\/\/[^\s<]+)<\/link>/) ||
                   block.match(/<link[^>]*>\s*(https?:\/\/[^\s<]+)\s*<\/link>/) || [])[1];
    const desc  = (block.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                   block.match(/<description[^>]*>([\s\S]*?)<\/description>/) || [])[1];
    if (title && link) {
      items.push({
        title: title.trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        link:  link.trim(),
        desc:  (desc || '').replace(/<[^>]+>/g, '').trim().slice(0, 200),
      });
    }
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PautasBot/1.0)' },
      timeout: 12000,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseItems(xml).slice(0, 6).map(i => ({ ...i, source: feed.name }));
  } catch (err) {
    console.warn(`⚠️  ${feed.name} falhou: ${err.message}`);
    return [];
  }
}

async function fetchTopNews() {
  const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
  const all = results.flat();

  // deduplica por título similar (primeiros 40 chars)
  const seen = new Set();
  const unique = [];
  for (const item of all) {
    const key = item.title.toLowerCase().slice(0, 40);
    if (!seen.has(key)) { seen.add(key); unique.push(item); }
  }
  return unique.slice(0, 10);
}

// ── Gemini (gratuito) ────────────────────────────────────────────────────────

async function generateAngles(news) {
  const newsBlock = news
    .map((n, i) => `${i + 1}. [${n.source}] ${n.title}${n.desc ? '\n   ' + n.desc : ''}`)
    .join('\n\n');

  const prompt = `Você é um estrategista de conteúdo para advogada premium especializada em advocacia extrajudicial, planejamento patrimonial e direito imobiliário (@karenlira.adv no Instagram).

Sua missão: para cada notícia do dia, criar 3 ângulos de conteúdo que conectem o tema ao universo jurídico, filosófico ou psicológico de forma que gere engajamento nas redes sociais — mesmo que a notícia não seja do nicho jurídico.

Regras:
- O ângulo jurídico deve conectar a notícia a direitos do cotidiano, contratos, planejamento patrimonial ou imobiliário
- O ângulo filosófico/psicológico deve trazer reflexão mais profunda sobre o comportamento humano, valores ou decisões
- A sugestão de formato deve ser específica: Reels 60s, Carrossel (X slides), Newsletter, Stories poll etc.
- Use linguagem direta, contemporânea, sem juridiquês
- O gancho de cada ângulo deve ter no máximo 2 linhas — deve parecer um post pronto para copiar

Aqui estão as top notícias do Brasil de hoje, ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}:

${newsBlock}

Para cada notícia, responda EXATAMENTE neste formato JSON (array de objetos):
[
  {
    "id": 1,
    "titulo": "título original resumido",
    "fonte": "nome da fonte",
    "angulo_juridico": "gancho + conexão jurídica em 2-3 linhas",
    "angulo_filosofico": "gancho + reflexão em 2-3 linhas",
    "formato": "formato recomendado + motivo em 1 linha",
    "emoji": "1 emoji que representa o tema"
  }
]

Retorne APENAS o JSON, sem texto antes ou depois.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini não retornou conteúdo');

  // extrai o JSON mesmo se vier com markdown fences
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini não retornou JSON válido');
  return JSON.parse(jsonMatch[0]);
}

// ── Email ────────────────────────────────────────────────────────────────────

function buildEmail(angles) {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const cards = angles.map(a => `
    <div style="background:white;border-radius:14px;padding:22px 24px;margin-bottom:16px;box-shadow:0 2px 12px rgba(124,92,191,0.07);border-left:4px solid #7C5CBF;">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <span style="font-size:1.5rem;">${a.emoji}</span>
        <div>
          <div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.8px;color:#7C5CBF;margin-bottom:3px;">${a.fonte}</div>
          <div style="font-size:0.92rem;font-weight:700;color:#1a1a2e;line-height:1.35;">${a.titulo}</div>
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.8px;color:#059669;margin-bottom:5px;font-weight:700;">⚖️ Ângulo Jurídico</div>
        <div style="font-size:0.82rem;color:#374151;line-height:1.55;background:#f0fdf4;border-radius:8px;padding:10px 12px;">${a.angulo_juridico}</div>
      </div>

      <div style="margin-bottom:10px;">
        <div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.8px;color:#7C5CBF;margin-bottom:5px;font-weight:700;">🧠 Ângulo Filosófico / Psicológico</div>
        <div style="font-size:0.82rem;color:#374151;line-height:1.55;background:#faf5ff;border-radius:8px;padding:10px 12px;">${a.angulo_filosofico}</div>
      </div>

      <div style="display:inline-block;background:#1a1a2e;color:#e8e0ff;font-size:0.68rem;font-weight:600;padding:5px 12px;border-radius:20px;">
        📱 ${a.formato}
      </div>
    </div>`).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8f7fc;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <div style="background:linear-gradient(135deg,#7C5CBF 0%,#5b3fa0 100%);border-radius:16px;padding:28px 32px;margin-bottom:20px;">
      <div style="color:#c4b5fd;font-size:0.68rem;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;">Pautas do Dia</div>
      <div style="color:white;font-size:1.5rem;font-weight:800;margin-bottom:4px;">Suas 10 pautas de hoje ✨</div>
      <div style="color:#ddd6fe;font-size:0.8rem;">@karenlira.adv · ${today}</div>
    </div>

    <div style="background:#fff8e1;border-radius:12px;padding:14px 18px;margin-bottom:20px;border-left:4px solid #f59e0b;">
      <div style="font-size:0.75rem;color:#92400e;font-weight:700;margin-bottom:4px;">💡 Como usar este email</div>
      <div style="font-size:0.78rem;color:#78350f;line-height:1.5;">Para cada notícia você recebe 3 ângulos: jurídico, filosófico e formato. Escolha o que mais ressoa e adapte com sua voz. Você não precisa postar sobre a notícia — use o ângulo como <strong>gancho de entrada</strong>.</div>
    </div>

    ${cards}

    <div style="text-align:center;padding:24px 0 8px;">
      <a href="https://karenlyra-wq.github.io/Painel-de-Agentes-Digitais/dashboard/"
         style="background:#7C5CBF;color:white;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:0.85rem;font-weight:700;display:inline-block;">
        → Abrir Painel Completo
      </a>
    </div>

    <div style="text-align:center;font-size:0.65rem;color:#9ca3af;padding:20px 0;">
      Gerado automaticamente · todo dia às 7h · @karenlira.adv
    </div>
  </div>
</body>
</html>`;

  const text = `PAUTAS DO DIA — @karenlira.adv\n${today}\n\n` +
    angles.map(a =>
      `${a.emoji} ${a.titulo} [${a.fonte}]\n` +
      `⚖️ Jurídico: ${a.angulo_juridico}\n` +
      `🧠 Filosófico: ${a.angulo_filosofico}\n` +
      `📱 Formato: ${a.formato}\n`
    ).join('\n---\n\n');

  return { html, text };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!GEMINI_API_KEY)    { console.error('❌ GEMINI_API_KEY não definida');    process.exit(1); }
  if (!RESEND_API_KEY)    { console.error('❌ RESEND_API_KEY não definida');    process.exit(1); }

  console.log('→ Buscando notícias...');
  const news = await fetchTopNews();
  console.log(`   ${news.length} notícias encontradas`);

  if (news.length === 0) {
    console.error('❌ Nenhuma notícia encontrada nos feeds RSS');
    process.exit(1);
  }

  console.log('→ Gerando ângulos com Claude...');
  const angles = await generateAngles(news);
  console.log(`   ${angles.length} pautas geradas`);

  const { html, text } = buildEmail(angles);

  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const weekday = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });

  console.log('→ Enviando email...');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `✨ ${angles.length} pautas para ${weekday}, ${today} — @karenlira.adv`,
      html,
      text,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('❌ Resend error:', JSON.stringify(result));
    process.exit(1);
  }

  console.log(`✅ Email enviado! ID: ${result.id} → ${TO_EMAIL}`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
