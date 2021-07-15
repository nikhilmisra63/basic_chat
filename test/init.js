/* eslint-disable global-require */
const supertest = require('supertest');
const serverUtils = require('../utils/serverUtils');

before(async () => {
  global.request = require('supertest');
  global.expect = require('chai').expect;
  global.assert = require('chai').assert;

  require('../index.js');
  await serverUtils.boot(app);
  global.request = supertest(app);
});

after(async () => {
  setTimeout(() => {
    process.exit(0);
  }, 100);
});
