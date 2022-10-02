//
// /controllers/user.js
//
var dbModels = require('../models/');
const bcrypt = require('bcrypt');

var userController = {
  //新規アカウント作成
  createUser: function (req, res) {
    let password = req.body.password;
    console.log(password);
    // let hashedPassword = bcrypt.hash(password, 10);
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
      if (user != undefined) {
        console.log('login succeed !');
        console.log('userId: ' + user[0].id);
        req.session.login = user[0].id;
        console.log('req.session.login is: ' + req.session.login);
        res.sendStatus(200);
      } else {
        console.log('user not exist :(');
        res.sendStatus(400);
      }
    });
  },

  logout: function (req, res) {
    req.session.login = undefined;
    res.sendStatus(200);
  },

  showUserById: function (req, res, next) {
    var userId = req.params.userId; // ユーザーIDを取得
    if (!userId) {
      console.log('ユーザーIDを取得できませんでした');
      res.send('Error');
    } else {
      // Sequelizeのモデルを使ってデータを取得する
      dbModels.User.findByPk(userId).then((user) => {
        if (!user) {
          console.log('ユーザーデータを取得できませんでした');
          res.send('Error');
        } else {
          res.render('oneUser', { user: user });
        }
      });
    }
  },

  sendJson: function (req, res, next) {
    // Sequelizeのモデルを使ってデータを取得する
    dbModels.User.findAll().then((users) => {
      if (!users) {
        console.log('ユーザーデータを取得できませんでした');
        res.send('Error');
      } else {
        res.json(users);
      }
    });
  },
};

module.exports = userController;
