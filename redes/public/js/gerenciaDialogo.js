// Cria um diálogo para chamadas recebidas, com opções de aceitar ou rejeitar a chamada
export const obtemChamada = (dadosChamada, gerenciaAceitaChamada, gerenciaRejeitaChamada) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");  // Adiciona classe para o contêiner do diálogo
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");  // Adiciona classe para o conteúdo do diálogo
  dialog.appendChild(dialogContent);

  // Cria o título do diálogo com o tipo de chamada
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Chamando: ${dadosChamada}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");  // Adiciona classe para o contêiner de botões

  //  Cria o botão de aceitar chamada
  const aceitaChamadaButton = document.createElement("button");
  aceitaChamadaButton.classList.add("dialog_accept_call_button");
  const aceitaChamadaImg = document.createElement("img");
  aceitaChamadaImg.classList.add("dialog_button_image");
  const aceitaChamadaImgPath = "./utils/images/acceptCall.png";  // Caminho da imagem para o botão de aceitar
  aceitaChamadaImg.src = aceitaChamadaImgPath;
  aceitaChamadaButton.append(aceitaChamadaImg);
  buttonContainer.appendChild(aceitaChamadaButton);

  // Cria o botão de rejeitar chamada
  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "./utils/images/rejectCall.png";  // Caminho da imagem para o botão de rejeitar
  rejectCallImg.src = rejectCallImgPath;
  rejectCallButton.append(rejectCallImg);
  buttonContainer.appendChild(rejectCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(buttonContainer);

  // Define o que acontece quando o botão de aceitar é clicado
  aceitaChamadaButton.addEventListener("click", () => {
    gerenciaAceitaChamada();
  });

  // Define o que acontece quando o botão de rejeitar é clicado
  rejectCallButton.addEventListener("click", () => {
    gerenciaRejeitaChamada();
  });

  return dialog;
};

// Cria um diálogo para chamadas em andamento com a opção de encerrar a chamada
export const getDialogoChamada = (gerenciaRejeitaChamada) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");  // Adiciona classe para o contêiner do diálogo
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");  // Adiciona classe para o conteúdo do diálogo
  dialog.appendChild(dialogContent);

  // Cria o título do diálogo indicando que a chamada está em andamento
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Chamando`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");  // Adiciona classe para o contêiner de botões

  // Cria o botão para encerrar a chamada
  const hangUpCallButton = document.createElement("button");
  hangUpCallButton.classList.add("dialog_reject_call_button");
  const hangUpCallImg = document.createElement("img");
  hangUpCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "./utils/images/rejectCall.png";  // Caminho da imagem para o botão de encerrar
  hangUpCallImg.src = rejectCallImgPath;
  hangUpCallButton.append(hangUpCallImg);
  buttonContainer.appendChild(hangUpCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(buttonContainer);

  // Define o que acontece quando o botão de encerrar a chamada é clicado
  hangUpCallButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;
};

// Cria um diálogo de informações genérico com título e descrição
export const getInfDialog = (dialogTitle, dialogDescription) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");  // Adiciona classe para o contêiner do diálogo
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");  // Adiciona classe para o conteúdo do diálogo
  dialog.appendChild(dialogContent);

  // Cria o título do diálogo
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = dialogTitle;

  // Cria a descrição do diálogo
  const description = document.createElement("p");
  description.classList.add("dialog_description");
  description.innerHTML = dialogDescription;

  dialogContent.appendChild(title);
  dialogContent.appendChild(description);

  return dialog;
};

// Cria um contêiner para mensagens recebidas (lado esquerdo)
export const getLeftMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_left_container");  // Adiciona classe para o contêiner da mensagem recebida
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_left_paragraph");
  messageParagraph.innerHTML = message;
  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};

// Cria um contêiner para mensagens enviadas (lado direito)
export const getRightMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_right_container");  // Adiciona classe para o contêiner da mensagem enviada
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_right_paragraph");
  messageParagraph.innerHTML = message;
  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};
