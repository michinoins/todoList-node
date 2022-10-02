//
// /controllers/todo.js
//
const { sequelize } = require('../models/');
var dbModels = require('../models/');
const { Op } = require('sequelize');

var todoController = {
  showAllTodos: function (req, res, next) {
    const userId = req.session.login;
    // Sequelizeのモデルを使ってデータを取得する
    sequelize
      .query(
        `select "Todos".* from "Todos" inner join "User_Todos" on "Todos"."id" = "User_Todos"."todoId"` +
          `where  "User_Todos"."userId"=${userId};`
      )
      .then((result) => {
        const todos = result[0];
        // how this is sorting
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
        todos.sort((a, b) => {
          const da = new Date(a.createdAt);
          const db = new Date(b.createdAt);
          return da - db;
        });
        if (!todos) {
          console.log('Fail to load users');
          res.send('Error');
        } else {
          console.log('response is' + todos);
          res.setHeader('Content-Type', 'application/json');
          res.json(todos);
        }
      });
  },

  addTodo: function (req, res, next) {
    const currentTime = new Date().toISOString();
    const todo = req.body.todo;
    console.log('before currentUser');
    console.log('req.session.login is: ' + req.session.login);

    const currentUser = req.session.login;

    console.log('currentUser is ' + currentUser);

    dbModels.Todo.create({
      name: todo,
      createdAt: currentTime,
      updatedAt: currentTime,
    }).then((created) => {
      console.log('created Todo id is ' + created.id);
      dbModels.User_Todo.create({
        userId: currentUser,
        todoId: created.id,
        createdAt: currentTime,
        updatedAt: currentTime,
      }).then(() => {
        res.sendStatus(200);
      });
    });
  },

  deleteTodo: function (req, res, next) {
    const todoId = req.params['id'];
    const userId = req.session.login;
    dbModels.Todo.destroy({
      where: {
        id: todoId,
      },
    }).then(() => {
      dbModels.User_Todo.destroy({
        where: {
          userId: userId,
          todoId: todoId,
        },
      }).then(() => {
        res.sendStatus(200);
      });
    });
  },
  deleteAllTodo: function (req, res, next) {
    const userId = req.session.login;
    dbModels.User_Todo.destroy({
      where: {
        userId: userId,
      },
    }).then(() => {
      sequelize
        .query(
          `delete  from "Todos" USING "User_Todos" Where "Todos"."id" = "User_Todos"."todoId" 
        and "User_Todos"."userId"=${userId};`
        )
        .then(() => {
          console.log('all todo deleted');
          res.sendStatus(200);
        });
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
    const userId = req.session.login;
    const targetTodo = req.query.targetTodo;
    console.log('target is ' + targetTodo);

    sequelize
      .query(
        `select "Todos".* from "Todos" inner join "User_Todos" on "Todos"."id" = "User_Todos"."todoId" 
      where "User_Todos"."userId" = 4 and "Todos"."name" like '%${targetTodo}%'`
      )
      .then((result) => {
        if (!result) {
          console.log('Fail to load users');
          res.send('Error');
        } else {
          const todos = result[0];
          console.log('get todo' + todos);
          res.setHeader('Content-Type', 'application/json');
          res.json(todos);
        }
      });
  },
};

module.exports = todoController;
