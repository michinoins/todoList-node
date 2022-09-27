//
// /controllers/todo.js
//
const { Sequelize } = require('../models/');
var dbModels = require('../models/');

var todoController = {
  showAllTodos: function (req, res, next) {
    // Sequelizeのモデルを使ってデータを取得する
    dbModels.Todo.findAll().then((todos) => {
      if (!todos) {
        console.log('ユーザーデータを取得できませんでした');
        res.send('Error');
      } else {
        res.json(todos);
      }
    });
  },

  addTodo: function (req, res, next) {
    // Sequelizeのモデルを使ってデータを取得する
    const currentTime = new Date().toISOString();
    const name = req.body.name;

    dbModels.Todo.create({
      name: name,
      createdAt: currentTime,
      updatedAt: currentTime,
      currentTime,
    }).then(() => {
      console.log('todo [' + name + ' ] is created');
      res.sendStatus(200);
    });
  },

  updateTodo: function (req, res, next) {
    // Sequelizeのモデルを使ってデータを取得する
    const uniqueId = req.body.id;
    const updateName = req.body.name;
    const currentTime = new Date().toISOString();

    dbModels.Todo.update(
      { name: updateName, createdAt: currentTime, updatedAt: currentTime },
      {
        where: {
          id: uniqueId,
        },
      }
    ).then(() => {
      console.log('updatedTodo: ' + updateName);
      res.sendStatus(200);
    });
  },
};

module.exports = todoController;
