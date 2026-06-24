const TK_AGENT_MODALS = {
  ideator: {
    title: '💡 Ideador — 5 ideias de vídeo para esta semana',
    body: 'Baseado nos formatos que mais performam no TikTok jurídico (nicho advocacia premium, jun/2026):',
    list: [
      '📌 "Um erro no contrato de imóvel que ninguém te conta" — TikTok 60s + Reels: formato "coisas que aprendi sendo advogada imobiliária" (inspirado no storytelling de @abarbara.torres)',
      '📌 "Você pode resolver isso sem ir ao tribunal" — Vídeo explicando mediação/arbitragem em 45s. Gancho: "a maioria dos conflitos pode acabar em 30 dias"',
      '📌 "POV: você assinou um contrato sem ler" — Formato POV com situação real (anônima). Alto potencial de compartilhamento por identificação',
      '📌 "3 coisas que protegem seu patrimônio e você não sabia" — Lista rápida com cards animados. Formato que @leanadeeb usa muito com alta retenção',
      '📌 "Advogada responde: isso é crime?" — Série de resposta a perguntas do TikTok. Baixo custo de produção, alto volume de engajamento',
    ]
  },
  hook: {
    title: '✍️ Hook & Script — Roteiro TikTok (60–90 segundos)',
    body: 'Roteiro para o vídeo de maior potencial desta semana:',
    list: [
      '🎬 HOOK (0-3s): [na tela, direto ao ponto] "Você está prestes a comprar um imóvel. Existe uma cláusula que 9 em cada 10 compradores não leem — e que pode custar caro."',
      '⚡ CONTEXTO (3-10s): "Sou advogada especialista em direito imobiliário. Hoje vou te mostrar o que verifico em todo contrato antes de qualquer assinatura."',
      '📋 DESENVOLVIMENTO (10-50s): Ponto 1 (10-20s) — cláusula de rescisão: "Quem pode rescindir, em que prazo e com qual multa?" Ponto 2 (20-35s) — garantias: "Fiança, seguro-fiança ou título de capitalização: qual protege você de verdade?" Ponto 3 (35-50s) — entrega e multas: "Se atrasar, qual é a penalidade contratual? Isso precisa estar no papel."',
      '🔖 CTA (50-60s): "Antes de assinar qualquer contrato de imóvel, me chama no direct. Consulte sempre um advogado especialista." [texto na tela: @karenlira.adv]',
      '🎵 TRILHA: Som trending de fundo neutro — evitar músicas com letra para não competir com a narração.',
    ]
  },
  planner: {
    title: '📅 Planejador — Calendário TikTok (próximos 7 dias)',
    body: 'Frequência recomendada para crescimento: 3–5 vídeos/semana, misturando formatos:',
    list: [
      '📅 Segunda 19h — Vídeo educativo: "Um erro no contrato de imóvel que ninguém te conta" (formato narração + texto na tela)',
      '📅 Quarta 12h — POV ou situação real: "POV: você assinou um contrato sem ler" (formato storytelling rápido)',
      '📅 Quinta 19h — Série "Advogada responde": responder uma pergunta comum do nicho em até 45s',
      '📅 Sexta 18h — Lista rápida: "3 coisas que protegem seu patrimônio" (cards com texto grande + voz over)',
      '⚠️ Nota dos concorrentes: @abarbara.torres posta 4-5x/semana — consistência é o principal diferencial. @marianagoncalvesadvogada usa muito duet e resposta a comentários para crescer organicamente.',
    ]
  },
  analyst: {
    title: '📊 Analista — Benchmark TikTok (jun/2026)',
    body: 'Comparativo com as contas concorrentes no nicho jurídico premium:',
    list: [
      '📈 @abarbara.torres — Referência principal do nicho jurídico no TikTok BR. Alta frequência de publicação, usa storytelling pessoal + conteúdo educativo. Engajamento forte via duets e respostas a comentários.',
      '📈 @leanadeeb — Foco em listas rápidas e formato "coisas que aprendi". Alta retenção por vídeos de 30-45s com legenda na tela. Funciona bem para nichos de finanças/direito.',
      '📈 @marianagoncalvesadvogada — Perfil com posicionamento similar ao seu (advocacia premium). Usa muito a série "advogada responde" para crescimento orgânico.',
      '🎯 GAP identificado: Nenhuma das concorrentes foca especificamente em direito imobiliário + planejamento patrimonial para alto padrão no formato TikTok. Este é o seu diferencial competitivo.',
      '💡 Seu canal: 3.119 seguidores, 902 curtidas totais — base inicial sólida. Próximo passo: consistência de publicação (3x/semana mínimo) para ativar o algoritmo do TikTok.',
    ]
  },
  comments: {
    title: '💬 Comentários — Templates de resposta TikTok',
    body: 'Modelos para responder os comentários mais comuns no nicho jurídico:',
    list: [
      '📩 "Isso aconteceu comigo!" → "Obrigada por compartilhar! Infelizmente é mais comum do que parece. Se quiser entender melhor os seus direitos nessa situação, me chama no direct 🙏 (sempre com um advogado, cada caso é único)"',
      '📩 "Quanto custa uma consultoria?" → "Oi! Os valores variam de acordo com a complexidade do caso. Me manda uma mensagem com mais detalhes e te respondo com o melhor caminho ✨"',
      '📩 "Você pode me ajudar com meu caso?" → "Oi! Para te ajudar da forma certa, precisa ser via consultoria para analisar os detalhes. Me chama no direct com um resumo da situação 😊"',
      '📩 "É possível fazer sem advogado?" → "Em alguns casos sim, mas os riscos são altos — especialmente em imóveis e contratos de valor. Vale o investimento em uma consultoria para evitar problemas maiores depois 🔒"',
      '📩 Comentário negativo/provocativo → Não responder publicamente se for de má-fé. Se for dúvida real: "Boa pergunta! Existem exceções — depende muito do caso concreto. Consulte sempre um advogado 😊"',
    ]
  }
};

function openTikTokAgentModal(key) {
  const m = TK_AGENT_MODALS[key];
  if (!m) return;
  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-body').innerHTML =
    `<p style="margin-bottom:12px;color:#6b7280;font-size:0.82rem;">${m.body}</p>` +
    `<ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">${
      m.list.map(i=>`<li style="background:#f8f7fc;border-radius:10px;padding:12px 14px;font-size:0.82rem;line-height:1.55;">${i}</li>`).join('')
    }</ul>`;
  document.getElementById('agent-modal').style.display = 'flex';
}

function closeTikTokModal() {
  document.getElementById('agent-modal').style.display = 'none';
}
