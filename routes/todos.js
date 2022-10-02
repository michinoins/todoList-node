var express = require('express');
var router = express.Router();
var todoController = require('../controllers/todo');

/* GET users listing. */

router.get('/', todoController.showAllTodos);
router.post('/', todoController.addTodo);
router.put('/:id', todoController.updateTodo);
router.put('/:id/toggle', todoController.updateToggle);
router.delete('/:id', todoController.deleteTodo);
router.delete('/', todoController.deleteAllTodo);
router.get('/search', todoController.searchTodo);

module.exports = router;
