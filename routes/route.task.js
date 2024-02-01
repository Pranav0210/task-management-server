const express = require('express')
const router = express.Router()
import {createTask, createSubTask, getAllUserTasks, getAllUserSubTasks, updateTask, updateSubTask, deleteTask, deleteSubTask} from '../controllers/taskController.js'
import { validateUpdateRequest } from '../middleware/validation.js'

router.post('/user-tasks/:user', getAllUserTasks)
router.post('/user-subtasks/:user', getAllUserSubTasks)

router.post('/create-task', createTask)
router.post('/create-subtask', createSubTask)

router.delete('/delete-task/:id', deleteTask)
router.delete('/delete-subtask/:id', deleteSubTask)

router.use(validateUpdateRequest)
router.patch('/update-task/:id', updateTask)
router.patch('/update-subtask/:id', updateSubTask)