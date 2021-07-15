const sendMessage = async (message) => {
  io.sockets.in(`/Member/Message/${message.groupId}`).emit(`/Member/Message`, message.toJSON());
};
module.exports = sendMessage;
