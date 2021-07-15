const Promise = require('bluebird');
const asyncModule = require('async');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

module.exports = {
  hashPassword: (password) =>
    new Promise(async (resolve, reject) => {
      try {
        await bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      } catch (e) {
        reject(e);
      }
    }),
  matchPassword: (plain, password) =>
    new Promise(async (resolve, reject) => {
      if (password && plain) {
        const isMatch = bcrypt.compareAsync(plain, password);
        resolve(isMatch);
      } else {
        resolve(false);
      }
    }),
  runPolicies(req, res, next) {
    const list = this;
    asyncModule.eachSeries(
      list,
      (policy, cb) => {
        // eslint-disable-next-line import/no-dynamic-require
        require(`../policies/${policy}`)(req, res, next, cb);
      },
      (err, result) => {
        if (err) return next(err);

        const error = new Error('Unauthenticated');
        error.statusCode = 401;
        return next(error);
      }
    );
  }
};
