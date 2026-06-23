const AGENT_MODALS = {
  ideator: {
    title: '💡 Ideador — 5 ideias desta semana',
    body: 'Baseado nos posts mais virais dos seus concorrentes e nos gaps de conteúdo no nicho de advocacia premium:',
    list: [
      '📌 "3 erros que fazem seu contrato de compra de imóvel ser anulado" — Reels 60s',
      '📌 "O que é mediação e por que evita meses de processo judicial" — Carrossel',
      '📌 "Seu planejamento patrimonial está incompleto se não tiver isso" — Reels',
      '📌 "Diferença entre inventário extrajudicial e judicial — qual escolher" — Vídeo',
      '📌 "Due diligence imobiliária: o checklist completo" — Carrossel premium',
    ]
  },
  hook: {
    title: '✍️ Hook & Script — Roteiro da semana',
    body: 'Roteiro pronto para o Reel de maior potencial desta semana:',
    list: [
      '🎬 HOOK (0-3s): "Esse erro custa caro — e a maioria dos compradores de imóvel comete sem saber."',
      '📝 DESENVOLVIMENTO (3-45s): 3 erros principais em contratos imobiliários. Um por um, com exemplo real. Sem juridiquês.',
      '💡 VIRADA (45-55s): "A solução não é advogado caro. É advogado certo, antes de assinar."',
      '📣 CTA (55-60s): "Salva esse vídeo antes de fechar qualquer negócio imobiliário."',
      '✍️ LEGENDA: "Você não precisa de sorte na compra do seu imóvel. Você precisa de due diligence."',
    ]
  },
  planner: {
    title: '📅 Planejador — Calendário desta semana',
    body: 'Baseado nos seus horários mais ativos (pico às 15h) e na análise de que 96.6% das suas views vem de Stories:',
    list: [
      '📆 Segunda 15h — Reels: "3 erros no contrato de imóvel" (explorar alcance fora dos seguidores)',
      '📆 Terça 12h — Story interativo: poll ou caixa de perguntas jurídicas',
      '📆 Quarta 15h — Carrossel: "O que é mediação" (salvar + compartilhar)',
      '📆 Quinta 09h — Story: bastidores do escritório (humanização)',
      '📆 Sexta 15h — Reels: "Planejamento patrimonial" (CTA para DM)',
      '📆 Sábado 12h — Carrossel: "Due diligence imobiliária" (evergreen)',
      '⚠️ FOCO DA SEMANA: aumentar views em Posts e Reels (hoje estão em 3.2% e 0.1% — Stories dominam 96.6%)',
    ]
  },
  analyst: {
    title: '📊 Analista — Diagnóstico (jun/2026)',
    body: 'Análise baseada nos Insights reais dos últimos 30 dias:',
    list: [
      '📈 17.553 visualizações no total | 1.088 contas alcançadas',
      '⚠️ 96.6% das views vem de Stories — Reels e Posts estão subaproveitados',
      '⏰ Melhor horário para postar: 15h (332 seguidores ativos) | 12h (321) | 9h (318)',
      '👥 829 seguidores | 313 visitas ao perfil | 102 contas engajadas',
      '🎯 Prioridade: publicar mais Reels com hooks fortes para crescer alcance fora dos seguidores (hoje apenas 26.3%)',
    ]
  },
  dm: {
    title: '💬 DM Manager — Templates prontos',
    body: 'Respostas para as DMs mais comuns no nicho jurídico premium:',
    list: [
      '📩 CONSULTA: "Olá! Fico feliz com seu interesse. Trabalho com clientes que buscam soluções estratégicas e personalizadas. Para entender melhor o seu caso, podemos agendar uma conversa de 20 minutos? [link agenda]"',
      '📩 PREÇO: "Cada caso tem suas particularidades e o valor é definido após entendermos o seu objetivo. O foco está sempre em resolver de forma eficiente — sem processos desnecessários quando existe uma solução mais inteligente."',
      '📩 "É legal isso?": "Essa é exatamente a pergunta certa antes de agir! Existem pontos importantes a analisar. Recomendo uma conversa para que eu possa orientar com base no seu caso específico. Posso te ajudar a marcar?"',
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
