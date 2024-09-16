import * as estados from "./estados.js";
import * as gerenciaInterface from "./gerenciaInterface.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constantes from "./constantes.js";

let socketIO = null;

// Registra eventos do socket e define os manipuladores de eventos
export const registerSocketEvents = (socket) => {
  socketIO = socket;

  // Evento de conexão: armazena o ID do socket e atualiza o código pessoal na interface
  socket.on("connect", () => {
    estados.setSocketId(socket.id);  // Armazena o ID do socket no estado
    gerenciaInterface.updatePersonalCode(socket.id);  // Atualiza o código pessoal na interface
  });

  // Evento de pré-oferta: delega o tratamento para o handler WebRTC
  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);  // Processa a pré-oferta de WebRTC
  });

  // Evento de resposta de pré-oferta: delega o tratamento para o handler WebRTC
  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);  // Processa a resposta da pré-oferta
  });

  // Evento de usuário que encerrou a chamada: delega o tratamento para o handler WebRTC
  socket.on("user-hanged-up", () => {
    webRTCHandler.handleConnectedUserHangedUp();  // Processa o evento de usuário que encerrou a chamada
  });

  // Evento de sinalização WebRTC: delega o tratamento com base no tipo de sinalização
  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constantes.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);  // Processa a oferta WebRTC
        break;
      case constantes.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);  // Processa a resposta WebRTC
        break;
      case constantes.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);  // Processa o candidato ICE WebRTC
        break;
      default:
        return;  // Ignora outros tipos de sinalização
    }
  });
};

// Envia uma pré-oferta via socket
export const sendPreOffer = (data) => {
  socketIO.emit("pre-offer", data);  // Emite o evento de pré-oferta
};

// Envia uma resposta de pré-oferta via socket
export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);  // Emite o evento de resposta da pré-oferta
};

// Envia dados de sinalização WebRTC via socket
export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);  // Emite o evento de sinalização WebRTC
};

// Envia o evento de usuário que encerrou a chamada via socket
export const sendUserHangedUp = (data) => {
  socketIO.emit("user-hanged-up", data);  // Emite o evento de usuário que encerrou a chamada
};
