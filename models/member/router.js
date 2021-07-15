const { Router } = require('express');
const { body } = require('express-validator/check');
const controller = require('./controller');
const validator = require('../../utils/validator');
const auth = require('../../utils/auth');

const router = new Router();

// SignUp, get Profile, updated profile and logout
router
  .route('/')
  .post(
    [
      body('name').exists().trim().withMessage('Invalid Name'),
      body('email').exists().isEmail().trim().withMessage('Invalid Email'),
      body('password').exists().isLength({ min: 6, max: 30 }).withMessage('Invalid Password'),
      validator
    ],
    (...args) => controller.signUp(...args)
  )
  .get(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.me(...args))

  .delete(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.logout(...args));

// login
router
  .route('/Login')
  .post(
    [
      body('email').isEmail().exists().withMessage('Invalid email'),
      body('deviceType').optional().isIn(['android', 'ios', 'web']).withMessage('Invalid deviceType'),
      body('pushToken').optional(),
      validator
    ],
    (...args) => controller.login(...args)
  );

router
  .route('/Message')
  .post(
    [
      [body('message').isString().exists().withMessage('Invalid message'), validator],
      auth.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.addMessage(...args)
  )
  .get(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.getAllMessage(...args));

router
  .route('/Group')
  .post(
    [
      [body('name').isString().exists().withMessage('Invalid Name'), validator],
      auth.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.createGroup(...args)
  );

router
  .route('/Group/Member')
  .post(
    [
      [
        body('memberId').isString().exists().withMessage('Invalid memberId'),
        body('groupId').isString().exists().withMessage('Invalid GroupId'),
        validator
      ],
      auth.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.addMember(...args)
  );

module.exports = router;
