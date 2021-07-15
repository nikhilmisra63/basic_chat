const memberFacade = require('../models/member/facade');

module.exports = async function (req, res, next, cb) {
  let member = null;
  const accessTokenId = req.header('Authorization');
  if (!accessTokenId) {
    return cb(null, false);
  }

  try {
    member = await memberFacade.findOne({
      where: { token: accessTokenId }
    });
    if (!member) return cb(null, false);
    req.member = member;
    next();
  } catch (e) {
    return cb(null, false);
  }
};
