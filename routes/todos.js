var express = require('express');
var router = express.Router();
var todoController = require('../controllers/todo');

/* GET users listing. */

router.get('/', todoController.showAllTodos);
router.post('/', todoController.addTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
// deleteAllはどうしよう・・・ router.delete('/', todoController.deleteTodo);
router.get('/search/:targetTodo', todoController.searchTodo);

module.exports = router;
