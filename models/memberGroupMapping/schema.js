const Sequelize = require('sequelize');
const shortId = require('shortid');

const memberGroupMapping = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  idDeleted: { type: Sequelize.BOOLEAN },
  memberId: { type: Sequelize.STRING },
  groupId: { type: Sequelize.STRING }
};

const memberGroupMappingSchema = sequelize.define('MemberGroupMapping', memberGroupMapping, {
  freezeTableName: true
});

module.exports = memberGroupMappingSchema;

// const memberSchema = require('../member/schema');
// const groupSchema = require('../group/schema');
// const messageSchema = require('../messages/schema');

// messageSchema.belongsTo(memberSchema, {
//   foreignKey: 'memberId',
//   as: 'member',
//   targetKey: 'id'
// });

// messageSchema.belongsTo(groupSchema, {
//   foreignKey: 'groupId',
//   as: 'group',
//   targetKey: 'id'
// });
