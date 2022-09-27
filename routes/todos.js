var express = require('express');
var router = express.Router();
var todoController = require('../controllers/todo');

/* GET users listing. */

router.get('/', todoController.showAllTodos);
router.post('/', todoController.addTodo);
router.put('/', todoController.updateTodo);

module.exports = router;
