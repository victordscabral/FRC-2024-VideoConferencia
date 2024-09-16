import * as constantes from "./constantes.js";
import * as gerenciaDialogo from "./gerenciaDialogo.js";

// Atualiza o parágrafo que exibe o código pessoal
export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById("personal_code_paragraph");
  personalCodeParagraph.innerHTML = personalCode;
};

// Atualiza o vídeo local com a stream fornecida e inicia a reprodução quando os metadados são carregados
export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

// Exibe os botões para vídeo com base no código pessoal
export const showVideoCallButtons = () => {
  const personalCodebotaoVideo = document.getElementById("personal_code_video_button");
  showElement(personalCodebotaoVideo);
};

// Atualiza o vídeo remoto com a stream fornecida
export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
};

// Exibe o diálogo de chamada recebida com base no tipo de chamada e fornece manipuladores para aceitar ou rejeitar
export const showIncomingCallDialog = (callType, gerenciaAceitaChamada, gerenciaRejeitaChamada) => {
  const dadosChamada = callType === constantes.callType.CODIGO_CHAMADA ? "Chat" : "Vídeo";

  const incomingCallDialog = gerenciaDialogo.obtemChamada(
    dadosChamada,
    gerenciaAceitaChamada,
    gerenciaRejeitaChamada
  );

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

  dialog.appendChild(incomingCallDialog);
};

// Exibe o diálogo de chamada em andamento com um manipulador para rejeitar
export const showCallingDialog = (gerenciaRejeitaChamada) => {
  const callingDialog = gerenciaDialogo.getDialogoChamada(gerenciaRejeitaChamada);

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

  dialog.appendChild(callingDialog);
};

// Exibe um diálogo informativo com base na resposta da pré-oferta e remove-o após um tempo
export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_RECUSADA) {
    infoDialog = gerenciaDialogo.getInfoDialog(
      "Chamada recusada",
      "Sua chamada foi recusada"
    );
  }

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_NAO_ENCONTRADA) {
    infoDialog = gerenciaDialogo.getInfoDialog(
      "Chamada não encontrada",
      "Confira o código da chamada do destinatário"
    );
  }

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_INVALIDA) {
    infoDialog = gerenciaDialogo.getInfoDialog(
      "Não foi possível efetuar a chamada",
      "Destinatário ocupado. Tente novamente depois"
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);

    setTimeout(() => {
      removeAllDialogs();
    }, [4000]);
  }
};

// Remove todos os diálogos do elemento com id "dialog"
export const removeAllDialogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

// Exibe elementos de chamada com base no tipo de chamada
export const showCallElements = (callType) => {
  if (callType === constantes.callType.CODIGO_CHAMADA) {
    showChatCallElements();
  }

  if (callType === constantes.callType.CODIGO_VIDEO) {
    showVideoCallElements();
  }
};

// Exibe elementos específicos para chamadas de chat
const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById("finish_chat_button_container");
  showElement(finishConnectionChatButtonContainer);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  disableDashboard();
};

// Exibe elementos específicos para chamadas de vídeo
const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);

  const placeholder = document.getElementById("video_placeholder");
  hideElement(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  disableDashboard();
};

// Atualiza o botão do microfone com base no estado (ativo ou inativo)
const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";

export const updateMicButton = (micActive) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micActive ? micOffImgSrc : micOnImgSrc;
};

// Atualiza o botão da câmera com base no estado (ativo ou inativo)
const cameraOnImgSrc = "./utils/images/camera.png";
const cameraOffImgSrc = "./utils/images/cameraOff.png";

export const updateCameraButton = (cameraActive) => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc;
};

// Adiciona uma mensagem ao container de mensagens, alinhando à direita ou à esquerda
export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById("messages_container");
  const messageElement = right
    ? gerenciaDialogo.getRightMessage(message)
    : gerenciaDialogo.getLeftMessage(message);
  messagesContainer.appendChild(messageElement);
};

// Limpa todas as mensagens do container de mensagens
export const clearMessenger = () => {
  const messagesContainer = document.getElementById("messages_container");
  messagesContainer.querySelectorAll("*").forEach((n) => n.remove());
};

// Atualiza a interface do usuário após o término da chamada
export const updateUIAfterHangUp = (callType) => {
  enableDashboard();

  if (callType === constantes.callType.CODIGO_VIDEO) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButtons = document.getElementById("finish_chat_button_container");
    hideElement(chatCallButtons);
  }

  const newMessageInput = document.getElementById("new_message");
  hideElement(newMessageInput);
  clearMessenger();

  updateMicButton(false);
  updateCameraButton(false);

  const remoteVideo = document.getElementById("remote_video");
  hideElement(remoteVideo);

  const placeholder = document.getElementById("video_placeholder");
  showElement(placeholder);

  removeAllDialogs();
};

// Habilita o painel de controle (remove a classe de bloqueio)
const enableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.add("display_none");
  }
};

// Desabilita o painel de controle (adiciona a classe de bloqueio)
const disableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.remove("display_none");
  }
};

// Oculta um elemento adicionando a classe "display_none"
const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};

// Exibe um elemento removendo a classe "display_none"
const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
