//
// /controllers/user.js
//
var dbModels = require('../models/');
const bcrypt = require('bcrypt');

var userController = {
  createUser: function (req, res) {
    let password = req.body.password;
    console.log(password);
    // later implement hashedPassword = bcrypt.hash(password, 10);
    const hashedPassword = password;
    const name = req.body.username;
    const currentTime = new Date().toISOString();
    dbModels.User.create({
      name: name,
      password: hashedPassword,
      createdAt: currentTime,
      updatedAt: currentTime,
    }).then(() => {
      console.log('user [ ' + name + ' ]  created');
      res.sendStatus(200);
    });
  },

  login: function (req, res) {
    console.log('login func');
    const name = req.body.username;
    const password = req.body.password;
    dbModels.User.findAll({
      where: { name: name, password: password },
    }).then((user) => {
      console.log('about login ' + JSON.stringify(user));
      if (user) {
        console.log('login succeed !');
        console.log('userId: ' + user[0].id);
        req.session.login = user[0].id;
        console.log('req.session.login is: ' + req.session.login);
        res.sendStatus(200);
      } else {
        res.end(JSON.stringify({ errorCode: 400 }));
        res.sendStatus(400);
      }
    });
  },

  logout: function (req, res) {
    req.session.login = undefined;
    res.sendStatus(200);
  },

  showUserById: function (req, res, next) {
    var userId = req.params.userId;
    if (!userId) {
      console.log('Fail to load User Id');
      res.send('Error');
    } else {
      dbModels.User.findByPk(userId).then((user) => {
        if (!user) {
          console.log('Fail to load users');
          res.send('Error');
        } else {
          res.render('oneUser', { user: user });
        }
      });
    }
  },

  sendJson: function (req, res, next) {
    dbModels.User.findAll().then((users) => {
      if (!users) {
        console.log('Fail to load users');
        res.send('Error');
      } else {
        res.json(users);
      }
    });
  },
};

module.exports = userController;
