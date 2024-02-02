const express = require('express')
const router = express.Router()
const {createTask, createSubTask, getAllUserTasks, getAllUserSubTasks, updateTask, updateSubTask, deleteTask, deleteSubTask} = require('../controllers/taskController.js')
const { validateUpdateRequest } = require('../middleware/validation.js')

router.get('/user-tasks/:user', getAllUserTasks)
router.get('/user-subtasks/:user', getAllUserSubTasks)

router.post('/create-task', createTask)
router.post('/create-subtask', createSubTask)

router.delete('/delete-task/:id', deleteTask)
router.delete('/delete-subtask/:id', deleteSubTask)

router.use(validateUpdateRequest)
router.patch('/update-task/:id', updateTask)
router.patch('/update-subtask/:id', updateSubTask)

module.exports = router