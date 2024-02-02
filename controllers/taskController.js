const mongoose = require('mongoose');
const {Task} = require('../models/model.task.js');
const {SubTask} = require('../models/model.subtask.js');
const {taskPriority} = require("../util/priority.js");
const { validateMobile } = require('../middleware/validation.js');
const { StatusCodes } = require('http-status-codes');
// import BadRequestError from '../util/errors/bad-request.js';

const getAllUserTasks = async (req, res) => {
    try {
        const { user } = req.params;
        const {priority, due_date, status, limit, offset, sort_by} = req.query

        const tasks = await Task.find(
            {
                priority: priority,
                users: {$elemMatch:{["_id"] : user}}
            });

        const response = {
            data: tasks,
            pagination:{
                total: tasks.length,
                per_page: 10,
                current_page: 1,
                total_pages: 1
            }
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getAllUserSubTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const {task_id, status, limit, offset, sort_by} = req.query
        var subtasks = [];

        if(task_id !== undefined){
            const count = Task.find(
                {
                    _id: task_id, 
                    status: status, 
                    users: {$elemMatch:{["_id"] : user}}
                }).count()
            if(count){
                subtasks = await SubTask.find({task_id : task_id})
            }
        }
        else
            subtasks = await SubTask.find({ task_id: task_id,  });

        const response = {
            data: subtasks,
            pagination:{
                total: tasks.length,
                per_page: 10,
                current_page: 1,
                total_pages: 1
            }
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const createTask = async (req, res) => {
  try {
    const { title, description, due_date, users } = req.body;
    users.forEach(user => {
        if(!users.find({_id: user["user_id"]}))
            res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid User in list"});
    });
    //validate if no two users have the same priority
    const priority = taskPriority(due_date);
    const newTask = new Task({
      title,
      description,
      due_date,
      priority,
      users
    });
    await newTask.save();

    //if the task has a priority of 0, add it to the local tasksList (mock cache)
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;
    const newSubTask = new SubTask({
      task_id,
      created_at: Date.now()
    });
    await newSubTask.save();

    res.status(201).json(newSubTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, due_date } = req.body;

    if(status !== "DONE" && status !== "TODO")
            res.status(400).json({ error: "Invalid status" });

    if(due_date)
        var priority = taskPriority(due_date);

    const updatedTask = await Task.findOneAndUpdate(id, { status, due_date, priority}, { new: true });
    
    //check if the due_date has changed and if task must be placed into or removed from local taskList.
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateSubTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(status !== 0 && status !== 1)
            res.status(400).json({ error: "Invalid status" })

        const updatedSubTask = await SubTask.findOneAndUpdate(id, { status, udpated_at:Date.now() }, { new: true });
        const ParentTask = await Task.findOne({_id : updatedSubTask.task_id});

        if(updatedSubTask.status === 1)
            ParentTask.completed_subtask += 1;
        else
            ParentTask.completed_subtask -= 1;

        if(ParentTask.completed_subtask == ParentTask.total_subtask)
            ParentTask.status = "DONE";
        else
            if(ParentTask.completed_subtask == 0)
                ParentTask.status = "TODO";
            else
                ParentTask.status = "IN_PROGRESS";
        
        ParentTask.updated_at = Date.now();
        await ParentTask.save();

        //check if task is DONE and must be removed from the local tasksList.
        res.status(200).json(updatedSubTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const session = await mongoose.startSession();
        
        const deletedTask = await Task.findOneAndUpdate(id, {archived : true});
        const phantomSubTasks = await SubTask.find({task_id : id});
        phantomSubTasks.forEach(async (subtask) => {
            subtask.archived = true;
            subtask.deleted_at = Date.now();
            await subtask.save();
        });

        res.status(200).json(deletedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteSubTask = async (req, res) => {
    const { id } = req.params;
    try {
        const session = mongoose.startSession();

        const deletedSubTask = await SubTask.findOneAndUpdate(id, {archived : true});
        const ParentTask = await Task.findOne({_id : deletedSubTask.task_id});
        ParentTask.total_subtask -= 1;
        if(deletedSubTask.status === 1)
            ParentTask.completed_subtask -= 1;
        else
            if(ParentTask.completed_subtask == ParentTask.total_subtask || ParentTask.total_subtask == 0)
                ParentTask.status = "DONE";
        
        await ParentTask.save();

        res.status(200).json(deletedSubTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTask,
    createSubTask, 
    getAllUserTasks, 
    getAllUserSubTasks, 
    updateTask, 
    updateSubTask, 
    deleteTask, 
    deleteSubTask
}