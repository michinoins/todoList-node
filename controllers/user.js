//
// /controllers/user.js
//
var dbModels = require('../models/');

var userController = {
  showAllUsers: function (req, res, next) {
    // Sequelizeのモデルを使ってデータを取得する
    dbModels.User.findAll().then((users) => {
      if (!users) {
        console.log('ユーザーデータを取得できませんでした');
        res.send('Error');
      } else {
        res.render('allUsers', { users: users });
      }
    });
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
