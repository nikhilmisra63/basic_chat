const { Router } = require('express');
const config = require('config');
const member = require('./models/member/router');
const router = new Router();
const version = config.get('version');

router.route('/').get((req, res) => {
  res.json({ message: `WELCOME TO ${config.get('APP_NAME')}!` });
});

router.use(`/${version}/Member`, member);

module.exports = router;
