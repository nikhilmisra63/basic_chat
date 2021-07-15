const Facade = require('../../lib/facade');
const memberSchema = require('./schema');
class MemberFacade extends Facade {
  async updateOnlineStatus(isOnline, memberId) {
    // const query = `UPDATE Member SET isOnline = ${isOnline} WHERE id=${memberId};`;
    return this.update({ isOnline }, { where: { id: memberId } });
  }
}

module.exports = new MemberFacade(memberSchema);
