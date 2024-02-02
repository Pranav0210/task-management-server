const express = require('express')
const router = express.Router()
const {createTask, createSubTask, getAllUserTasks, getAllUserSubTasks, updateTask, updateSubTask, deleteTask, deleteSubTask} = require('../controllers/taskController.js')
const { validateUpdateRequest } = require('../middleware/validation.js')

router.get('/user-tasks/:user', getAllUserTasks)
router.get('/user-subtasks/:user', getAllUserSubTasks)

router.post('/create-task', createTask)
router.post('/create-subtask', createSubTask)

router.delete('/delete-task/:task', deleteTask)
router.delete('/delete-subtask/:task', deleteSubTask)

router.use(validateUpdateRequest)
router.put('/update-task/:user', updateTask)
router.put('/update-subtask/:user', updateSubTask)

module.exports = router