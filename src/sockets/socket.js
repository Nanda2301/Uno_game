let io = null;

function initSocket(socketServer) {
  io = socketServer;
}

function getIO() {
  if (!io) {
    return {
      to: () => ({
        emit: () => {}
      })
    };
  }

  return io;
}

module.exports = {
  initSocket,
  getIO
};