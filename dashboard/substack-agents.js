const SS_AGENT_MODALS = {
  ideator: {
    title: '💡 Ideador — 5 ideias de newsletter para esta semana',
    body: 'Temas de alto valor para um público premium que quer proteger patrimônio e tomar decisões melhores:',
    list: [
      '📌 "O contrato que você nunca leu — e que pode te custar caro" — Edição educativa sobre cláusulas abusivas em contratos imobiliários. Alta abertura por gerar medo saudável + solução prática.',
      '📌 "Como proteger seu patrimônio antes do casamento (e ninguém te conta isso)" — Regime de bens, pacto antenupcial, planejamento. Tema de alto engajamento e muito compartilhado.',
      '📌 "Herança sem briga: o guia extrajudicial que poucos conhecem" — Inventário extrajudicial, holding familiar. Público premium tem patrimônio pra planejar — esse tema converte.',
      '📌 "A decisão do STJ que mudou (ou vai mudar) o seu contrato de aluguel" — Reativo a notícia recente. Mostra que você está atualizada e conecta direito à vida real.',
      '📌 "Por que mediação é melhor que processo — em números" — Comparativo real de custo/tempo/desgaste. Edição que posiciona sua especialidade extrajudicial.',
    ]
  },
  hook: {
    title: '✍️ Hook & Estrutura — Modelo de newsletter premium',
    body: 'Estrutura para uma newsletter de 600–900 palavras que retém leitores de alto padrão:',
    list: [
      '📩 ASSUNTO DO EMAIL (decisivo): Fuja de "Newsletter #3". Use: "O erro que vi em 9 de cada 10 contratos de imóvel" ou "Isso pode invalidar seu inventário" — gera curiosidade + urgência.',
      '🎯 ABERTURA (50–80 palavras): Comece com uma situação real (anônima) ou uma pergunta. "Uma cliente chegou até mim depois de assinar um contrato há 2 anos. Só então descobriu que havia uma cláusula que..." — o leitor precisa se ver na história.',
      '📋 DESENVOLVIMENTO (400–600 palavras): 3 blocos curtos com subtítulos. Cada bloco: problema → contexto jurídico → o que fazer. Linguagem direta, zero juridiquês. Uma analogia por bloco.',
      '💡 VIRADA: O insight que só você daria. A perspectiva jurídica que parece óbvia depois que você explica mas que ninguém tinha pensado antes.',
      '🔖 CTA final: Uma ação clara e leve. "Se você tem um contrato que nunca foi revisado, me responde esse email." — convida conversa, não venda direta. Adicionar: "Consulte sempre um advogado de confiança."',
    ]
  },
  planner: {
    title: '📅 Planejador — Cadência ideal para Substack',
    body: 'Estratégia de publicação para construir audiência premium sem sobrecarregar a produção:',
    list: [
      '📅 Frequência recomendada: 1x por semana — toda terça ou quarta às 8h. Consistência é mais importante que volume no Substack. Leitores premium não toleram spam.',
      '📅 Semana 1 — Educativo atemporal: tema que sempre será relevante (ex: contratos, herança, regime de bens). Fica evergreen e atrai busca orgânica.',
      '📅 Semana 2 — Reativo a notícia: pegue um tema da semana e dê o ângulo jurídico. Aproveite o que já está gerando engajamento nas redes.',
      '📅 Semana 3 — Caso real (anônimo): "Uma situação que vi no escritório esta semana". Humaniza, gera identificação, alto compartilhamento.',
      '⚙️ Dica de produção: escreva a newsletter primeiro, depois adapte para carrossel (Instagram) e roteiro curto (TikTok/Reels). Um conteúdo, três formatos — economiza tempo.',
    ]
  },
  analyst: {
    title: '📊 Analista — Métricas que importam no Substack',
    body: 'O que acompanhar para saber se sua newsletter está crescendo da forma certa:',
    list: [
      '📈 Taxa de abertura (Open Rate): benchmark do Substack para newsletters de nicho é 40–60%. Abaixo de 30% → revisar assunto do email e frequência de envio.',
      '📈 Taxa de clique (CTR): mede se o conteúdo gerou ação. Links para "consultar um advogado" ou "responder o email" são os mais importantes para o seu nicho.',
      '📈 Crescimento de assinantes: mais importante que o número absoluto é a tendência. 10 novos assinantes/semana de forma consistente supera 100 num pico e zero depois.',
      '🎯 Métrica de conversão: quantos assinantes viraram consultas? No nicho premium, 1 cliente vindo da newsletter já justifica meses de produção. Marque manualmente quando isso acontecer.',
      '💡 Benchmark de concorrentes: newsletters jurídicas premium em PT-BR ainda são raras — você não tem concorrência direta. Referências internacionais: The Pragmatic Engineer (tech), Morning Brew (negócios) — ambas cresceram com consistência + nicho claro.',
    ]
  },
  drafts: {
    title: '✏️ Rascunhos — Banco de ideias salvas',
    body: 'Ideias para futuras edições — salve aqui os temas antes de esquecer:',
    list: [
      '💾 "Due diligence imobiliária: o checklist que uso antes de qualquer compra" — Conteúdo de autoridade, alto valor percebido, funciona como lead magnet',
      '💾 "O que muda no seu contrato quando você muda de estado civil" — Gatilho: casamento, divórcio, viuvez. Muito compartilhado por estar em momento de vida',
      '💾 "Arbitragem: o que grandes empresas sabem que pessoas físicas ignoram" — Posiciona você no mercado premium, diferencia da advocacia de massa',
      '💾 "Planejamento patrimonial não é só para ricos — é para quem não quer ficar sem nada" — Quebra objeção, democratiza o acesso ao tema sem desposicionar',
      '💾 "Os 3 documentos que toda pessoa com imóvel deveria ter assinado ontem" — Lista prática, gatilho de urgência, CTA natural para consultoria',
    ]
  }
};

function openSubstackAgentModal(key) {
  const m = SS_AGENT_MODALS[key];
  if (!m) return;
  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-body').innerHTML =
    `<p style="margin-bottom:12px;color:#6b7280;font-size:0.82rem;">${m.body}</p>` +
    `<ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">${
      m.list.map(i=>`<li style="background:#f8f7fc;border-radius:10px;padding:12px 14px;font-size:0.82rem;line-height:1.55;">${i}</li>`).join('')
    }</ul>`;
  document.getElementById('agent-modal').style.display = 'flex';
}

function closeSubstackModal() {
  document.getElementById('agent-modal').style.display = 'none';
}
