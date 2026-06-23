const YT_AGENT_MODALS = {
  ideator: {
    title: '💡 Ideador — 5 ideias de vídeo para esta semana',
    body: 'Baseado nos vídeos que mais performaram nos canais concorrentes no YouTube (jun/2026):',
    list: [
      '📌 "Você está assinando um contrato de imóvel sem ler isso?" — Vídeo 8-12min (inspirado no formato de gaps jurídicos de @abarbaratorres)',
      '📌 "Inventário sem briga: o guia extrajudicial que ninguém te contou" — Vídeo explicativo 10min (formato de nicho subexplorado)',
      '📌 "Advogada explica: por que seu contrato de aluguel pode ser nulo" — Vídeo de autoridade (espelhando o "accountant explains" de @nischa)',
      '📌 "Due diligence imobiliária: o que eu verifico antes de qualquer compra" — Vídeo de processo/bastidores 15min',
      '📌 "A verdade sobre mediação que os advogados não falam" — Vídeo de opinião com gancho provocativo (formato @_jared)',
    ]
  },
  hook: {
    title: '✍️ Hook & Script — Roteiro para YouTube (formato longo)',
    body: 'Roteiro completo para o vídeo de maior potencial desta semana (8-12 minutos):',
    list: [
      '🎬 HOOK (0-15s): "Você está prestes a assinar um contrato de imóvel. Mas antes disso — existe uma cláusula que 9 em cada 10 compradores ignoram. E essa cláusula pode te custar caro."',
      '🧭 CONTEXTO (15s-1min): Apresentação rápida. "Sou advogada especialista em direito imobiliário e hoje vou te mostrar os 3 pontos que verifico em todo contrato antes de assinar."',
      '📝 DESENVOLVIMENTO (1min-8min): Ponto 1 — cláusula de rescisão unilateral. Ponto 2 — garantias e fiança. Ponto 3 — prazo de entrega e multas. Cada ponto com exemplo real (sem nome de cliente).',
      '💡 VIRADA (8min-10min): "A solução não é desconfiar de todo mundo. É saber exatamente o que perguntar antes de assinar. E eu vou te dar o checklist completo."',
      '📣 CTA (10min-12min): "Salva esse vídeo antes da sua próxima negociação. Se quiser uma análise do seu contrato específico, o link para consulta está na descrição."',
      '✍️ TÍTULO SUGERIDO: "3 cláusulas que podem anular seu contrato imobiliário (a maioria ignora)"',
    ]
  },
  planner: {
    title: '📅 Planejador — Calendário YouTube desta semana',
    body: 'Estratégia baseada na frequência dos concorrentes: @barbaraferreira.a posta diariamente, @abarbaratorres 1-2x/semana, @_jared 1x/semana. Para um canal novo, recomendo 1 vídeo/semana com consistência:',
    list: [
      '📆 Terça 9h — Publicar vídeo principal ("3 cláusulas que podem anular seu contrato")',
      '📆 Terça 12h — Shorts: clip do momento mais impactante do vídeo (15-60s)',
      '📆 Quinta 9h — Community post: pergunta para engajar ("Já leu seu contrato de ponta a ponta?")',
      '📆 Sexta 9h — Shorts: dica jurídica rápida isolada do vídeo',
      '⚠️ OBSERVAÇÃO: @barbaraferreira.a posta 336 vídeos com 156K inscritos — volume alto é a estratégia dela. Para advocacia premium, profundidade vale mais que frequência.',
      '🎯 META DA SEMANA: consistência — 1 vídeo completo + 2 Shorts = presença sem comprometer qualidade',
    ]
  },
  analyst: {
    title: '📊 Analista — Benchmark YouTube (jun/2026)',
    body: 'Análise dos 4 concorrentes monitorados no YouTube:',
    list: [
      '🏆 @nischa lidera com 2.2M inscritos e 135M views totais — top vídeo: 414K views com hook "The easiest (& laziest) way to get rich"',
      '📈 @_jared: 758K inscritos, 40M views — top vídeo 228K views com "I don\'t like what the internet is doing to me" — formato ensaio/opinião performou melhor',
      '🇧🇷 @abarbaratorres: 223K inscritos (PT-BR), 6M views — top vídeo 40K views com gancho introspectivo sobre carisma',
      '🇧🇷 @barbaraferreira.a: 156K inscritos, 10.5M views com 336 vídeos — alta frequência, títulos de desenvolvimento pessoal',
      '🎯 GAP identificado: nenhum concorrente cobre advocacia premium / direito imobiliário em PT-BR — nicho aberto com alta demanda de busca',
      '🔑 Formato que mais performa no nicho: vídeo de 8-15min com título de "revelação" + hook de tensão nos primeiros 15 segundos',
    ]
  },
  dm: {
    title: '💬 Respostas para comentários — Templates prontos',
    body: 'Templates para os comentários mais comuns em vídeos jurídicos no YouTube:',
    list: [
      '💬 DÚVIDA JURÍDICA ESPECÍFICA: "Ótima pergunta! Cada caso tem suas particularidades e não seria responsável da minha parte responder sem conhecer os detalhes. Mas posso te ajudar direito — o link para agendamento está na descrição 👆"',
      '💬 ELOGIO/GRATIDÃO: "Fico muito feliz que tenha ajudado! Se quiser aprofundar em algum ponto, me conta nos comentários que priorizo no próximo vídeo 🙌"',
      '💬 DISCORDÂNCIA/QUESTIONAMENTO: "Ponto válido! O direito tem nuances e situações específicas podem ter tratamento diferente. Se quiser, aprofundo esse aspecto — qual região do Brasil você está?"',
      '💬 PEDIDO DE CONTEÚDO: "Anotei! Esse tema entra na lista dos próximos vídeos. Ativa o sininho para não perder quando sair 🔔"',
      '💬 CONSULTA VIA COMENTÁRIO: "Para uma análise do seu caso específico preciso de mais informações do que posso tratar aqui. Acessa o link na descrição para agendarmos uma conversa adequada ao que você precisa."',
    ]
  }
};

function openAgentModal(agentId) {
  const agent = YT_AGENT_MODALS[agentId];
  if (!agent) return;
  document.getElementById('modal-title').textContent = agent.title;
  document.getElementById('modal-body').textContent = agent.body;
  const ul = document.getElementById('modal-list');
  ul.innerHTML = '';
  agent.list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.marginBottom = '8px';
    ul.appendChild(li);
  });
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}
