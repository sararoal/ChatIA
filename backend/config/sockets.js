import { Server } from "socket.io";
import chatSocketHandler from "../sockets/chat.js"

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    chatSocketHandler(io, socket)

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}
