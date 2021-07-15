const Sequelize = require('sequelize');
const shortId = require('shortid');
const sendMessage = require('../../utils/io');

const messages = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  message: { type: Sequelize.STRING },
  memberId: { type: Sequelize.STRING },
  groupId: { type: Sequelize.STRING }
};

const messageSchema = sequelize.define('Message', messages, {
  freezeTableName: true
});
messageSchema.addHook('afterCreate', async (message) => {
  sendMessage(message);
});
module.exports = messageSchema;
