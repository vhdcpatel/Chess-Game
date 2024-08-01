module.exports.socketController = (socket) => {
  console.log("A user connected", socket.id);
  
  socket.on('move', (data) => {
    handleMove(socket, data);
  });

  socket.on('disconnect', () => {
    console.log("A user disconnected", socket.id);
  });
};

function handleMove(socket, data) {
  console.log('Move received:', data);
  // Broadcast the move to all clients except the sender
  socket.broadcast.emit('move', data);
}
