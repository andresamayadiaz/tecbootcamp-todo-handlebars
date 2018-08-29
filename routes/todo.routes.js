const express = require('express');
const router = express.Router();

// TODO CONTROLLER
const TodoController = require('../controllers/todo.controller');

/**
 * GET ALL TODO's
 */
router.get('/todos', TodoController.getAllTodos);

/**
 * GET COMPLETED TODOS
 */
router.get('/todos/completed', TodoController.getCompletedTodos);

/**
 * GET UNCOMPLETED TODOS
 */
router.get('/todos/uncompleted', TodoController.getUncompletedTodos);

/**
 * GET ONE TODO
 */
router.get('/todos/:id', TodoController.getTodo);

/**
 * POST ADD TODO
 */
router.post('/todos', TodoController.addTodo);

/**
 * PUT EDIT TODO
 */
router.put('/todos/:id', TodoController.editTodo);

/**
 * DELETE TODO
 */
router.delete('/todos/:id', TodoController.deleteTodo);

module.exports = router;