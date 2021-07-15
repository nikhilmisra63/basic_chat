const Sequelize = require('sequelize');
const shortId = require('shortid');

const member = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  name: { type: Sequelize.STRING },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: { type: Sequelize.STRING },
  token: { type: Sequelize.STRING },
  isOnline: { type: Sequelize.BOOLEAN, defaultValue: false }
};

const memberSchema = sequelize.define('Member', member, {
  freezeTableName: true
});

module.exports = memberSchema;

const memberGroupMappingSchema = require('../memberGroupMapping/schema');
// language Associations
memberSchema.belongsToMany(memberGroupMappingSchema, {
  through: 'MemberGroupMapping',
  as: 'group',
  foreignKey: 'memberId'
});
