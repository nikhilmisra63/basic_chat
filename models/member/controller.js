const uid2 = require('uid2');
const config = require('config');
const _ = require('lodash');
const Sequelize = require('sequelize');
const memberFacade = require('./facade');
const authUtils = require('../../utils/auth');
const messageFacade = require('../messages/facade');
const groupFacade = require('../group/facade');
const memberGroupMappingFacade = require('../memberGroupMapping/facade');
const { Op } = Sequelize;

class MemberController {
  // SignUp
  async signUp(req, res, next) {
    let member;
    const { name, email, password } = req.body;
    try {
      member = await memberFacade.findOne({ where: { email } });
    } catch (err) {
      return next(err);
    }
    if (member) {
      const e = new Error('Email Already exists');
      e.statusCode = 400;
      return next(e);
    }
    const hashPassword = await authUtils.hashPassword(password);
    try {
      member = await memberFacade.create({
        name,
        password: hashPassword,
        email
      });
    } catch (err) {
      return next(err);
    }

    res.send(member);
  }

  // Login
  async login(req, res, next) {
    let member;
    const { email, password } = req.body;
    try {
      member = await memberFacade.findOne({ where: { email } });
    } catch (err) {
      return next(err);
    }
    if (!member) {
      const e = new Error('Email or password is incorrect');
      e.statusCode = 401;
      return next(e);
    }
    if (!(await authUtils.matchPassword(password, member.password))) {
      const err = new Error('Email or password is incorrect');
      err.statusCode = 401;
      return next(err);
    }
    const token = uid2(config.get('accessTokenLength'));
    member.token = token;
    try {
      await member.save();
    } catch (err) {
      return next(err);
    }

    res.send(member);
  }

  async me(req, res, next) {
    res.send(req.member);
  }

  async logout(req, res, next) {
    req.member.token = null;
    try {
      await req.member.save();
    } catch (error) {
      return next(error);
    }
    res.json({ message: 'Successfully Logout' });
  }

  async createGroup(req, res, next) {
    const { name } = req.body;
    let group;
    try {
      group = await groupFacade.create({ name, createdBy: req.member.id });
    } catch (error) {
      return next(error);
    }
    res.send(group);
  }

  // Add Member in Group
  async addMember(req, res, next) {
    const { groupId, memberId } = req.body;
    let group;
    // check if group is exists and owned by the requested member or not
    try {
      group = await groupFacade.findOne({ where: { id: groupId, createdBy: req.member.id } });
    } catch (error) {
      return next(error);
    }
    if (!group) {
      const error = new Error('No Group Found');
      error.statusCode = 400;
      return next(error);
    }
    // Check if member already added in this group
    try {
      group = await memberGroupMappingFacade.findOne({ where: { groupId, memberId } });
    } catch (error) {
      return next(error);
    }
    if (group) {
      const error = new Error('Member Already Exists in this group');
      error.statusCode = 400;
      return next(error);
    }
    // add member in group
    try {
      group = await memberGroupMappingFacade.create({ groupId, memberId });
    } catch (error) {
      return next(error);
    }
    res.send(group);
  }

  async addMessage(req, res, next) {
    const { message, groupId, senderId, receiverId } = req.body;
    let dbMessage;
    if (!groupId && !senderId && !receiverId) {
      const error = new Error('id required');
      error.statusCode = 400;
      return next(error);
    }
    let group;
    // check requested member is added in group or not
    if (groupId) {
      try {
        group = await memberGroupMappingFacade.findAll({
          where: { groupId }
        });
      } catch (error) {
        return next(error);
      }
      const memberIds = _.map(group, 'memberId');
      if (!memberIds.includes(senderId) || !memberIds.includes(receiverId)) {
        const error = new Error('Member is not added in group');
        error.statusCode = 400;
        return next(error);
      }
    } else {
      try {
        group = await memberGroupMappingFacade.findOne({
          where: { name: `${senderId}-${receiverId}` }
        });
      } catch (error) {
        return next(error);
      }
      if (!group) {
        // create default group for one to one chat
        try {
          group = await groupFacade.create({
            name: `${senderId}-${receiverId}`,
            createdBy: req.member.id
          });
        } catch (error) {
          return next(error);
        }
        try {
          await memberGroupMappingFacade.create({
            memberId: senderId,
            groupId: group.id
          });
        } catch (error) {
          return next(error);
        }
        try {
          await memberGroupMappingFacade.create({
            memberId: receiverId,
            groupId: group.id
          });
        } catch (error) {
          return next(error);
        }
      }
    }
    try {
      await messageFacade.create({ message, groupId: groupId || group.id, memberId: req.member.id });
    } catch (error) {
      return next(error);
    }
    res.send(dbMessage);
  }

  async getAllMessage(req, res, next) {
    let messages;
    let groups;
    try {
      groups = await memberGroupMappingFacade.findAll({ where: { memberId: req.member.id } });
    } catch (error) {
      return next(error);
    }
    const groupIds = _.map(groups, 'groupId');
    try {
      messages = await messageFacade.findAll({ where: { groupId: { [Op.in]: groupIds } } });
    } catch (error) {
      return next(error);
    }
    res.send(messages);
  }
}

module.exports = new MemberController(memberFacade);
