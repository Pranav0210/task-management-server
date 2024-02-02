const mongoose = require('mongoose');
const Task = require('../models/model.task.js');
const SubTask = require('../models/model.subtask.js');
const User = require('../models/model.user.js');
const {taskPriority} = require("../util/priority.js");
const { validateMobile } = require('../middleware/validation.js');
const { StatusCodes } = require('http-status-codes');
const { tasksList } = require('../util/dataStructures.js');
// import BadRequestError from '../util/errors/bad-request.js';

const getAllUserTasks = async (req, res) => {
    try {
        const { user } = req.params;
        const {priority, due_date, status, limit, offset, sort_by} = req.query

        const tasks = await Task.find(
            {
                users: {$elemMatch:{_id : user}},
            });
        const response = {
            data: tasks,
            pagination:{
                total: tasks.length,
                page_size: 10,
                current_page: 1,
                total_pages: Math.ceil(tasks.length/10)
            }
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
const getAllUserSubTasks = async (req, res) => {
    try {
        const { user } = req.params;
        const {task_id, status, limit, offset, sort_by} = req.query
        var subtasks = [];

        if(task_id !== undefined){
            const count = Task.find(
                {
                    _id: task_id, 
                    status: status, 
                    users: {$elemMatch:{_id : user}}
                }).count()
            if(count){
                subtasks = await SubTask.find({task_id : task_id})
            }
        }
        else{
            const userTask = await Task.findOne({users: {$elemMatch:{_id : user}}});
            if(userTask)
            subtasks = await SubTask.find({ task_id: task_id,  });
        }

        const response = {
            data: subtasks,
            pagination:{
                total: subtasks.length,
                page_size: 10,
                current_page: 1,
                total_pages: Math.ceil(subtasks.length/10)
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
    if(new Date(due_date) < Date.now()){
        return res.status(400).send(`Invalid due_date: date value in the past`);
    }
    for(const user of users) {
        const {_id} = user
        const userDoc = await User.findOne({_id:`${_id}`}).exec()
        if(!userDoc)
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid User in list"});
    };
    //validate if no two users have the same priority
    const priority = taskPriority(due_date);
    const newTask = await Task.create({
        title: title,
        description : description,
        due_date: due_date,
        priority: priority,
        users: users,
        status: "TODO",
        created_at: Date.now(),
    });
    if(priority == 0){
        tasksList.push(newTask);
    }

    //if the task has a priority of 0, add it to the local tasksList (mock cache)
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

const createSubTask = async (req, res) => {
  try {
    const { task_id, title} = req.body;
    const newSubTask = new SubTask({
      task_id : task_id,
      title : title,
      created_at: Date.now()
    });
    await newSubTask.save();

    const ParentTask = await Task.findOne({_id : task_id});
    ParentTask.total_subtask += 1;
    ParentTask.updated_at = Date.now();
    if(ParentTask.status === "DONE")
        ParentTask.status = "IN_PROGRESS";
    await ParentTask.save();

    res.status(201).json(newSubTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateTask = async (req, res) => {
  try {
    const { user } = req.params;
    const { task_id, status, due_date } = req.body;

    const userTask = await Task.findOne({_id : task_id, users: {$elemMatch:{_id : user}}});
    if(!userTask)
        return res.status(StatusCodes.UNAUTHORIZED).json({"Unauthorized":"Task doesn't belong to user"});
    
        if(status !== "DONE" && status !== "TODO")
            res.status(400).json({ error: "Invalid status" });

    if(due_date)
        var priority = taskPriority(due_date);

    const updatedTask = await Task.findOneAndUpdate({id : task_id}, { status, due_date, priority}, { new: true });
    
    //check if the due_date has changed and if task must be placed into or removed from local taskList.
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateSubTask = async (req, res) => {
    try {
        const { user } = req.params;
        console.log(user)
        const { subtask_id, status } = req.body;

        if(status !== 0 && status !== 1)
            return res.status(400).json({ error: "Invalid status" })

        const updatedSubTask = await SubTask.findOneAndUpdate({_id:subtask_id}, { status, udpated_at:Date.now() }, { new: true });
        const ParentTask = await Task.findOne({_id : updatedSubTask.task_id});
        const usersAllowed = ParentTask.users.map((user) => {
            return user._id.toString();
        })
        console.log(usersAllowed)
        if(!usersAllowed.includes(user.toString()))
            return res.status(StatusCodes.UNAUTHORIZED).json({"Unauthorized":"Task doesn't belong to user"});

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
    const { task } = req.params;
    try {
        // const session = await mongoose.startSession();
        
        const deletedTask = await Task.findOneAndUpdate({_id:task}, {archived : true});
        const phantomSubTasks = await SubTask.find({task_id : task});
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
        const deletedSubTask = await SubTask.findOneAndUpdate(id, {archived : true});
        const ParentTask = await Task.findOne({_id : deletedSubTask.task_id});
        ParentTask.total_subtask -= 1;
        if(deletedSubTask.status === 1){
            ParentTask.completed_subtask -= 1;
            if(ParentTask.completed_subtask == 0)
                ParentTask.status = "TODO";
            else
                ParentTask.status = "IN_PROGRESS";
        }
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