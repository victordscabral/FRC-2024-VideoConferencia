import * as gerenciaWebSocket from "./gerenciaWebSocket.js"; 
import * as constantes from "./constantes.js"; 
import * as gerenciaInterface from "./gerenciaInterface.js"; 
import * as estados from "./estados.js"; 

let connectedUserDetails; 
let peerConection; 
let dataChannel; 

const defaultConstraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902", // Servidor STUN do Google
    },
  ],
};

// Função para obter o feed de vídeo/áudio local e configurar a interface do usuário
export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints) 
    .then((stream) => {
      gerenciaInterface.updateLocalVideo(stream); 
      gerenciaInterface.showVideoCallButtons(); 
      estados.setEstadoChamada(constantes.estadoChamada.CALL_AVAILABLE); 
      estados.setLocalStream(stream);
    })
    .catch((err) => {
      console.log("error occured when trying to get an access to camera");
      console.log(err);
    });
};

// Cria uma conexão peer-to-peer usando WebRTC
const createPeerConnection = () => {
  peerConection = new RTCPeerConnection(configuration); 

  dataChannel = peerConection.createDataChannel("chat"); 

  peerConection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log("peer connection is ready to receive data channel messages");
    };

    // Quando uma mensagem é recebida no canal de dados
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      gerenciaInterface.appendMessage(message); 
    };
  };

  // Quando um candidato ICE é encontrado
  peerConection.onicecandidate = (event) => {
    if (event.candidate) {
      gerenciaWebSocket.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constantes.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  peerConection.onconnectionstatechange = (event) => {
    if (peerConection.connectionState === "connected") {
    }
  };

  // Configura o stream remoto para exibir o vídeo/áudio do outro peer
  const remoteStream = new MediaStream();
  estados.setRemoteStream(remoteStream);
  gerenciaInterface.updateRemoteVideo(remoteStream); 

  peerConection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // Se a chamada for de vídeo, adiciona as trilhas do stream local à conexão
  if (connectedUserDetails.callType === constantes.callType.CODIGO_VIDEO) {
    const localStream = estados.getEstado().localStream;

    for (const track of localStream.getTracks()) {
      peerConection.addTrack(track, localStream); 
    }
  }
};

// Função para enviar mensagens via canal de dados
export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message); 
  dataChannel.send(stringifiedMessage); 
};

// Envia uma oferta de pré-chamada para outro peer
export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType, 
    socketId: calleePersonalCode, 
  };

  if (
    callType === constantes.callType.CODIGO_CHAMADA ||
    callType === constantes.callType.CODIGO_VIDEO
  ) {
    const data = {
      callType,
      calleePersonalCode,
    };
    gerenciaInterface.showCallingDialog(callingDialoggerenciaRejeitaChamada);
    estados.setEstadoChamada(constantes.estadoChamada.CHAMADA_INVALIDA);
    gerenciaWebSocket.sendPreOffer(data);
  }
};

// Lida com a pré-oferta recebida de outro peer
export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;

  if (!checkCallPossibility()) {
    return sendPreOfferAnswer(
      constantes.preOfferAnswer.CHAMADA_INVALIDA,
      callerSocketId
    );
  }

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  estados.setEstadoChamada(constantes.estadoChamada.CHAMADA_INVALIDA);

  if (
    callType === constantes.callType.CODIGO_CHAMADA ||
    callType === constantes.callType.CODIGO_VIDEO
  ) {
    gerenciaInterface.showIncomingCallDialog(callType, gerenciaAceitaChamada, gerenciaRejeitaChamada);
  }
};

// Aceita a chamada recebida e estabelece a conexão
const gerenciaAceitaChamada = () => {
  createPeerConnection(); 
  sendPreOfferAnswer(constantes.preOfferAnswer.CHAMADA_ACEITADA);
  gerenciaInterface.showCallElements(connectedUserDetails.callType);
};

// Rejeita a chamada recebida
const gerenciaRejeitaChamada = () => {
  sendPreOfferAnswer();
  setIncomingCallsAvailable();
  sendPreOfferAnswer(constantes.preOfferAnswer.CHAMADA_RECUSADA);
};

// Rejeição da chamada enquanto está tocando
const callingDialoggerenciaRejeitaChamada = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };
  closePeerConnectionAndResetState();
  gerenciaWebSocket.sendUserHangedUp(data);
};

// Envia uma resposta para a pré-oferta recebida
const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const socketId = callerSocketId
    ? callerSocketId
    : connectedUserDetails.socketId;
  const data = {
    callerSocketId: socketId,
    preOfferAnswer,
  };
  gerenciaInterface.removeAllDialogs();
  gerenciaWebSocket.sendPreOfferAnswer(data);
};

// Lida com a resposta da pré-oferta
export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  gerenciaInterface.removeAllDialogs();

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_NAO_ENCONTRADA) {
    gerenciaInterface.showInfoDialog(preOfferAnswer);
    setIncomingCallsAvailable();
  }

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_INVALIDA) {
    setIncomingCallsAvailable();
    gerenciaInterface.showInfoDialog(preOfferAnswer);
  }

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_RECUSADA) {
    setIncomingCallsAvailable();
    gerenciaInterface.showInfoDialog(preOfferAnswer);
  }

  if (preOfferAnswer === constantes.preOfferAnswer.CHAMADA_ACEITADA) {
    gerenciaInterface.showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};

// Envia uma oferta WebRTC para iniciar a conexão
const sendWebRTCOffer = async () => {
  const offer = await peerConection.createOffer();
  await peerConection.setLocalDescription(offer);
  gerenciaWebSocket.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constantes.webRTCSignaling.OFFER,
    offer: offer,
  });
};

// Lida com a oferta WebRTC recebida
export const handleWebRTCOffer = async (data) => {
  await peerConection.setRemoteDescription(data.offer);
  const answer = await peerConection.createAnswer();
  await peerConection.setLocalDescription(answer);
  gerenciaWebSocket.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constantes.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

// Lida com a resposta WebRTC recebida
export const handleWebRTCAnswer = async (data) => {
  await peerConection.setRemoteDescription(data.answer);
};

// Lida com candidatos ICE recebidos
export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error(
      "error occured when trying to add received ice candidate",
      err
    );
  }
};

// Lida com a situação em que o usuário encerra a chamada
export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  gerenciaWebSocket.sendUserHangedUp(data);
  closePeerConnectionAndResetState();
};

// Lida com a situação em que o outro usuário encerra a chamada
export const handleConnectedUserHangedUp = () => {
  closePeerConnectionAndResetState();
};

// Fecha a conexão WebRTC e redefine o estado da chamada
const closePeerConnectionAndResetState = () => {
  if (peerConection) {
    peerConection.close(); // Fecha a conexão WebRTC
    peerConection = null; // Reseta a conexão
  }

  if (connectedUserDetails.callType === constantes.callType.CODIGO_VIDEO) {
    estados.getEstado().localStream.getVideoTracks()[0].enabled = true;
    estados.getEstado().localStream.getAudioTracks()[0].enabled = true;
  }

  gerenciaInterface.updateUIAfterHangUp(connectedUserDetails.callType);
  setIncomingCallsAvailable();
  connectedUserDetails = null; 
};

// Verifica se é possível realizar a chamada com base no estado atual
const checkCallPossibility = (callType) => {
  const estadoChamada = estados.getEstado().estadoChamada; 

  if (estadoChamada === constantes.estadoChamada.CALL_AVAILABLE) {
    return true;
  }

  if (
    (callType === constantes.callType.CODIGO_VIDEO) &&
    estadoChamada === constantes.estadoChamada.CALL_AVAILABLE_ONLY_CHAT
  ) {
    return false;
  }

  return false;
};

// Define que chamadas recebidas estão disponíveis, de acordo com o estado do stream local
const setIncomingCallsAvailable = () => {
  const localStream = estados.getEstado().localStream;
  if (localStream) {
    estados.setEstadoChamada(constantes.estadoChamada.CALL_AVAILABLE);
  } else {
    estados.setEstadoChamada(constantes.estadoChamada.CALL_AVAILABLE_ONLY_CHAT); 
  }
};
