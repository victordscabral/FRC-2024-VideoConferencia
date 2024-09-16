import * as estados from "./estados.js";
import * as gerenciaWebSocket from "./gerenciaWebSocket.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constantes from "./constantes.js";
import * as gerenciaInterface from "./gerenciaInterface.js";

const socket = io("/");

// Registra os eventos do socket
gerenciaWebSocket.registerSocketEvents(socket);

webRTCHandler.getLocalPreview();

// Configura o botão para copiar o código pessoal para a área de transferência
const personalCodeCopyButton = document.getElementById("personal_code_copy_button");
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = estados.getEstado().socketId;  // Obtém o código pessoal do estado
  navigator.clipboard && navigator.clipboard.writeText(personalCode);  // Copia o código para a área de transferência
});

// Configura o botão para iniciar uma chamada de chat
const personalCodeChatButton = document.getElementById("personal_code_chat_button");
personalCodeChatButton.addEventListener("click", () => {
  const calleePersonalCode = document.getElementById("personal_code_input").value;  // Obtém o código pessoal do destinatário
  const callType = constantes.callType.CODIGO_CHAMADA;  // Define o tipo de chamada como chat

  // Envia uma pré-oferta para iniciar uma chamada de chat
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

// Configura o botão para iniciar uma chamada de vídeo
const personalCodebotaoVideo = document.getElementById("personal_code_video_button");
personalCodebotaoVideo.addEventListener("click", () => {
  const calleePersonalCode = document.getElementById("personal_code_input").value;  // Obtém o código pessoal do destinatário
  const callType = constantes.callType.CODIGO_VIDEO;  // Define o tipo de chamada como vídeo

  // Envia uma pré-oferta para iniciar uma chamada de vídeo
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

// Configura o botão para ativar/desativar o microfone
const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  const localStream = estados.getEstado().localStream;  // Obtém o fluxo de mídia local
  const micEnabled = localStream.getAudioTracks()[0].enabled;  // Verifica se o microfone está habilitado
  localStream.getAudioTracks()[0].enabled = !micEnabled;  // Alterna o estado do microfone
  gerenciaInterface.updateMicButton(micEnabled);  // Atualiza o ícone do botão do microfone na interface
});

// Configura o botão para ativar/desativar a câmera
const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  const localStream = estados.getEstado().localStream;  // Obtém o fluxo de mídia local
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;  // Verifica se a câmera está habilitada
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;  // Alterna o estado da câmera
  gerenciaInterface.updateCameraButton(cameraEnabled);  // Atualiza o ícone do botão da câmera na interface
});

// Configura o campo de entrada de mensagens para enviar mensagens ao pressionar Enter
const newMessageInput = document.getElementById("new_message_input");
newMessageInput.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter") {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);  // Envia a mensagem usando o canal de dados WebRTC
    gerenciaInterface.appendMessage(event.target.value, true);  // Adiciona a mensagem ao chat na interface
    newMessageInput.value = "";  // Limpa o campo de entrada
  }
});

// Configura o botão para enviar mensagens
const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", () => {
  const message = newMessageInput.value;  // Obtém a mensagem do campo de entrada
  webRTCHandler.sendMessageUsingDataChannel(message);  // Envia a mensagem usando o canal de dados WebRTC
  gerenciaInterface.appendMessage(message, true);  // Adiciona a mensagem ao chat na interface
  newMessageInput.value = "";  // Limpa o campo de entrada
});

// Configura o botão para encerrar a chamada
const hangUpButton = document.getElementById("hang_up_button");
hangUpButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();  // Encerra a chamada usando o handler WebRTC
});

// Configura o botão para encerrar a chamada de chat
const hangUpChatButton = document.getElementById("finish_chat_call_button");
hangUpChatButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();  // Encerra a chamada de chat usando o handler WebRTC
});
