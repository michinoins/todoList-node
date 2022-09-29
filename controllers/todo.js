//
// /controllers/todo.js
//
const { Sequelize } = require('../models/');
var dbModels = require('../models/');
const { Op } = require('sequelize');

var todoController = {
  showAllTodos: function (req, res, next) {
    console.log('show todo method');
    // Sequelizeのモデルを使ってデータを取得する
    dbModels.Todo.findAll().then((todos) => {
      // how this is sorting
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
      todos.sort((a, b) => {
        const da = new Date(a.createdAt);
        const db = new Date(b.createdAt);
        return da - db;
      });
      if (!todos) {
        console.log('ユーザーデータを取得できませんでした');
        res.send('Error');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.json(todos);
      }
    });
  },

  addTodo: function (req, res, next) {
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

  deleteTodo: function (req, res, next) {
    const id = req.params['id'];
    dbModels.Todo.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      console.log('todo [' + id + ' ] is deleted');
      res.sendStatus(200);
    });
  },

  updateTodo: function (req, res, next) {
    const id = req.params.id;
    const updateName = req.body.name;
    const currentTime = new Date().toISOString();

    dbModels.Todo.update(
      { name: updateName, updatedAt: currentTime },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      console.log('updatedTodo: ' + updateName);
      res.sendStatus(200);
    });
  },
  searchTodo: function (req, res, next) {
    const targetTodo = req.params.targetTodo;
    console.log('target is ' + targetTodo);

    dbModels.Todo.findAll({
      where: {
        name: {
          [Op.substring]: `${targetTodo}`, // name LIKE '%K%'
        },
      },
    }).then((todos) => {
      if (!todos) {
        console.log('ユーザーデータを取得できませんでした');
        res.send('Error');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.json(todos);
      }
    });
  },
};

module.exports = todoController;
