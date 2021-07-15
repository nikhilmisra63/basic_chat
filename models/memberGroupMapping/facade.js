const Facade = require('../../lib/facade');
const memberGroupMappingSchema = require('./schema');
class MemberGroupMappingFacade extends Facade {}

module.exports = new MemberGroupMappingFacade(memberGroupMappingSchema);
