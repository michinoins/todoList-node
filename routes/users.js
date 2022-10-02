var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET users listing. */

router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
