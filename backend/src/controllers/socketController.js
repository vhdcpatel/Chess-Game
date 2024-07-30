module.exports.initialize = (socket) => {
  socket.on('move', (data) => {
    handleMove(socket, data);
  });
};

function handleMove(socket, data) {
  console.log('Move received:', data);
  // Broadcast the move to all clients except the sender
  socket.broadcast.emit('move', data);
}
