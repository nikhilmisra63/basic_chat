const Facade = require('../../lib/facade');
const messageSchema = require('./schema');
class MessageFacade extends Facade {}

module.exports = new MessageFacade(messageSchema);
