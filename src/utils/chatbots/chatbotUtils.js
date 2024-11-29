const getChatBotSource = (pathName) => {
  let currentChatBotSource = '//painel.chatbot.place/';
  if (pathName.includes('/dre')) {
    currentChatBotSource = '//dre.chatbot.place/';
  }
  if (pathName.includes('/dfc')) {
    currentChatBotSource = '//dfc.chatbot.place/';
  }
  if (pathName.includes('/supplier')) {
    currentChatBotSource = '//fornecedores.chatbot.place/';
  }
  if (pathName.includes('/client')) {
    currentChatBotSource = '//clientes.chatbot.place/';
  }
  if (pathName.includes('/receivable')) {
    currentChatBotSource = '//contaareceber.chatbot.place/';
  }
  if (pathName.includes('/payable')) {
    currentChatBotSource = '//contaapagar.chatbot.place/';
  }
  if (pathName.includes('/bank-account')) {
    currentChatBotSource = '//contasbancarias.chatbot.place/';
  }
  if (pathName.includes('/transfer')) {
    currentChatBotSource = '//transferencias.chatbot.place/';
  }
  if (pathName.includes('/project')) {
    currentChatBotSource = '//projetos.chatbot.place/';
  }
  if (pathName.includes('/cost-center')) {
    currentChatBotSource = '//centrosdecusto.iuli.chatbot.place/';
  }
  if (pathName.includes('/product')) {
    currentChatBotSource = '//produtos.iuli.chatbot.place/';
  }
  if (pathName.includes('/product-link')) {
    currentChatBotSource = '//linksdepagamento.iuli.chatbot.place/';
  }
  if (pathName.includes('/sale')) {
    currentChatBotSource = '//vendas.iuli.chatbot.place/';
  }

  return currentChatBotSource;
};

export { getChatBotSource };
