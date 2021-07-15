const Sequelize = require('sequelize');
const shortId = require('shortid');

const group = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  name: { type: Sequelize.STRING },
  createdBy: { type: Sequelize.STRING },
  idDeleted: { type: Sequelize.BOOLEAN }
};

const groupSchema = sequelize.define('Group', group, {
  freezeTableName: true
});

module.exports = groupSchema;

const memberGroupMappingSchema = require('../memberGroupMapping/schema');

groupSchema.belongsToMany(memberGroupMappingSchema, {
  through: 'MemberGroupMapping',
  as: 'member',
  foreignKey: 'groupId'
});
