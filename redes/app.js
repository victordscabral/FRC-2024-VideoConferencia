const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// Inicializa o Socket.IO no servidor HTTP
const io = require("socket.io")(server);

app.use(express.static("public"));

// Roteia o acesso à raiz para o arquivo HTML principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Array para armazenar os IDs dos sockets conectados
let connectedPeers = [];

// Manipulador de eventos para quando um cliente se conecta via WebSocket
io.on("connection", (socket) => {
  // Adiciona o ID do socket à lista de pares conectados
  connectedPeers.push(socket.id);

  // Manipulador para o evento "pre-offer"
  socket.on("pre-offer", (data) => {
    const { calleePersonalCode, callType } = data;
    // Encontra o par conectado com o código pessoal do destinatário
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === calleePersonalCode
    );

    if (connectedPeer) {
      // Se o par estiver conectado, emite a pré-oferta para ele
      const responseData = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(calleePersonalCode).emit("pre-offer", responseData);
    } else {
      // Se o par não estiver conectado, envia uma resposta de erro para o chamador
      const responseData = {
        preOfferAnswer: "CHAMADA_NAO_ENCONTRADA",
      };
      io.to(socket.id).emit("pre-offer-answer", responseData);
    }
  });

  // Manipulador para o evento "pre-offer-answer"
  socket.on("pre-offer-answer", (data) => {
    const { callerSocketId } = data;
    // Verifica se o chamador está conectado
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === callerSocketId
    );

    if (connectedPeer) {
      // Se o chamador estiver conectado, emite a resposta da pré-oferta para ele
      io.to(callerSocketId).emit("pre-offer-answer", data);
    }
  });

  // Manipulador para o evento "webRTC-signaling"
  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId } = data;
    // Verifica se o usuário conectado está na lista de pares conectados
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === connectedUserSocketId
    );

    if (connectedPeer) {
      // Se o usuário estiver conectado, emite os dados de sinalização WebRTC para ele
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  // Manipulador para o evento "user-hanged-up"
  socket.on("user-hanged-up", (data) => {
    const { connectedUserSocketId } = data;
    // Verifica se o usuário conectado está na lista de pares conectados
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === connectedUserSocketId
    );

    if (connectedPeer) {
      // Se o usuário estiver conectado, emite o evento de desconexão para ele
      io.to(connectedUserSocketId).emit("user-hanged-up");
    }
  });

  // Manipulador para o evento de desconexão do socket
  socket.on("disconnect", () => {
    // Remove o ID do socket da lista de pares conectados
    connectedPeers = connectedPeers.filter(
      (peerSocketId) => peerSocketId !== socket.id
    );
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
