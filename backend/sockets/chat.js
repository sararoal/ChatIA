export default function chatSocketHandler(io, socket) {
  socket.on("chat:message", (msg) => {
    console.log(`📨 Mensaje recibido: ${msg}`);
    io.emit("chat:message", msg);
  });

  socket.on("join-conversation", (roomActual, roomNueva) => {
    if (roomActual) {
      socket.leave(roomActual);
      console.log(`📨 Salí de la sala: ${roomActual}`);
    }
    socket.join(roomNueva);
    console.log(`📨 Me uní a la sala: ${roomNueva}`);
  });

  socket.on("new-conversation", (roomActual, callback) => {
    socket.leave(roomActual);

    setImmediate(() => {
      const room = socket.adapter.rooms.get(roomActual);
      const stillInRoom = room?.has(socket.id);
      const hasLeft = !stillInRoom;

      if (!hasLeft) {
        console.log(`📨 No pude salir de la sala: ${roomActual}`);
      } else {
        console.log(`📨 Salí de la sala: ${roomActual}`);
      }

      callback(hasLeft);
    });
  });
}
