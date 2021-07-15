/* eslint-disable no-await-in-loop */
const Promise = require('bluebird');
const authUtils = require('../../utils/auth');

const defaultAdmins = [
  {
    name: 'Nikhil',
    password: 'zxcvbnm',
    email: 'nikhilmisra63@gmail.com'
  }
];
let password;
module.exports = (app) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    console.log('Boot script - initializing default_admin');

    const memberFacade = require('../../models/member/facade');
    for (const defaultAdmin of defaultAdmins) {
      password = await authUtils.hashPassword(defaultAdmin.password);
      defaultAdmin.password = password;
      try {
        const alreadyExistAdmin = await memberFacade.findOne({
          where: { email: defaultAdmin.email }
        });
        if (alreadyExistAdmin) {
          return resolve();
        }
        await memberFacade.create(defaultAdmin);
      } catch (e) {
        return reject(e);
      }
    }
    resolve();
  });
