const Facade = require('../../lib/facade');
const groupSchema = require('./schema');
class GroupFacade extends Facade {}

module.exports = new GroupFacade(groupSchema);
