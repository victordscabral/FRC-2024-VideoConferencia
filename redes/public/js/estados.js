import * as constantes from "./constantes.js";

let estado = {
  socketId: null,             // ID do socket para identificar a conexão do usuário
  localStream: null,          // Stream de vídeo/local do usuário
  remoteStream: null,         // Stream de vídeo/remoto do outro usuário
  estadoChamada: constantes.estadoChamada.CALL_AVAILABLE_ONLY_CHAT, // Estado atual da chamada 
};

// Função para definir o ID do socket
export const setSocketId = (socketId) => {
  estado = {
    ...estado,      
    socketId,    
  };
};

// Função para definir o stream local
export const setLocalStream = (stream) => {
  estado = {
    ...estado,     
    localStream: stream, 
  };
};

// Função para definir o stream remoto
export const setRemoteStream = (stream) => {
  estado = {
    ...estado,   
    remoteStream: stream, 
  };
};

// Função para definir o estado da chamada
export const setEstadoChamada = (estadoChamada) => {
  estado = {
    ...estado,      
    estadoChamada,  
  };
};

// Função para obter o estado atual
export const getEstado = () => {
  return estado;  
};
