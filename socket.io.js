io.on('connection', async (socket) => {
  const memberFacade = require('./models/member/facade');
  memberFacade.updateOnlineStatus(true, socket.handshake.query.memberId);
  socket.on('subscribe', async (path) => {
    socket.join(path);
  });

  socket.on('unsubscribe', (path) => {
    memberFacade.updateOnlineStatus(true, socket.handshake.query.memberId);
    socket.leave(path); // We are using room of socket io
  });
});
