const Promise = require('bluebird');

const options = {};
if (process.env.NODE_ENV === 'testing') options.force = true;

module.exports = (app) =>
  new Promise(async (resolve, reject) => {
    console.log('Boot script - Starting initdb');
    try {
      await sequelize.sync();
    } catch (e) {
      return reject(e);
    }
    console.log('Boot script - resolving init db');
    return resolve();
  });
