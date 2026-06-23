const AGENT_MODALS = {
  ideator: {
    title: '💡 Ideador — 5 ideias desta semana',
    body: 'Baseado nos posts mais virais dos seus concorrentes e nos gaps de conteúdo no nicho de advocacia premium, aqui estão as 5 melhores ideias para esta semana:',
    list: [
      '📌 "3 erros que fazem seu contrato de compra de imóvel ser anulado" — formato Reels 60s (tema top em @thaisschaly)',
      '📌 "O que é mediação e por que evita meses de processo judicial" — carrossel educativo',
      '📌 "Seu planejamento patrimonial está incompleto se não tiver isso" — Reels com gancho de urgência',
      '📌 "Diferença entre inventário extrajudicial e judicial — qual escolher" — vídeo explicativo direto',
      '📌 "Due diligence imobiliária: o que verificar antes de assinar qualquer contrato" — carrossel premium',
    ]
  },
  hook: {
    title: '✍️ Hook & Script — Roteiro da semana',
    body: 'Roteiro pronto para o Reel de maior potencial desta semana:',
    list: [
      '🎬 HOOK (0-3s): "Esse erro custa caro — e a maioria dos compradores de imóvel comete sem saber."',
      '📝 DESENVOLVIMENTO (3-45s): Apresentar os 3 principais erros em contratos imobiliários. Um por um, com exemplo real (sem citar cliente). Linguagem direta, sem juridiquês.',
      '💡 VIRADA (45-55s): "A solução não é advogado caro. É advogado certo, antes de assinar."',
      '📣 CTA (55-60s): "Salva esse vídeo antes de fechar qualquer negócio imobiliário."',
      '✍️ LEGENDA: "Você não precisa de sorte na compra do seu imóvel. Você precisa de due diligence. Comenta aqui se quer saber mais."',
    ]
  },
  planner: {
    title: '📅 Planejador — Calendário desta semana',
    body: 'Distribuição estratégica para maximizar alcance e consistência:',
    list: [
      '📆 Segunda 19h — Reels: "3 erros no contrato de imóvel" (educativo, alto potencial de shares)',
      '📆 Terça 12h — Story: poll "Você já fez due diligence antes de comprar?" (engajamento)',
      '📆 Quarta 19h — Carrossel: "O que é mediação" (salvar + compartilhar)',
      '📆 Quinta 08h — Story: bastidores do escritório (humanização)',
      '📆 Sexta 18h — Reels: "Planejamento patrimonial incompleto" (urgência + CTA para DM)',
      '📆 Sábado 10h — Carrossel: "Due diligence imobiliária" (conteúdo evergreen)',
      '📆 Domingo — Descanso (consistência > volume)',
    ]
  },
  analyst: {
    title: '📊 Analista — Diagnóstico da semana',
    body: 'Análise baseada nos dados reais coletados pelo scraper:',
    list: []
  },
  dm: {
    title: '💬 DM Manager — Templates prontos',
    body: 'Respostas rascunhadas para as DMs mais comuns no nicho jurídico premium:',
    list: [
      '📩 CONSULTA: "Olá! Fico feliz com seu interesse. Trabalho com clientes que buscam soluções estratégicas e personalizadas. Para entender melhor o seu caso, podemos agendar uma conversa de 20 minutos? [link agenda]"',
      '📩 PREÇO: "Cada caso tem suas particularidades e o valor é definido após entendermos o seu objetivo. O que posso garantir é que o foco está sempre em resolver de forma eficiente — sem processos desnecessários quando existe uma solução mais inteligente."',
      '📩 "É legal isso?": "Essa é exatamente a pergunta certa a se fazer antes de agir! Pelo que você descreveu, existem alguns pontos importantes a analisar. Recomendo uma conversa para que eu possa orientar com base no seu caso específico. Posso te ajudar a marcar?"',
    ]
  }
};

function openAgentModal(agentId) {
  const agent = AGENT_MODALS[agentId];
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

function openModal(id) {}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}
