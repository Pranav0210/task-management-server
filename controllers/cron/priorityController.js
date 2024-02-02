const {Task} = require('../../models/model.task.js');
const {tasksList} = require('../../util/localData');
const {overdueTasksQueue} = require('../../util/localData');

const priorityCron = async () =>{
    const pendingTasks = await Task.find({status: {$ne: "DONE"}});
    overdueTasksQueue.push(...tasksList);

    pendingTasks.filter((task)=> daysAway(task.due_date) == 0)
    pendingTasks.forEach(async(task)=>{
        if(daysAway(task.due_date) == 1 || daysAway(task.due_date) == 3 || daysAway(task.due_date) == 5){
            task.priority -= 1;
            await task.save();
            if(task.priority == 0)
                tasksList.push(task);
        }
        else if(daysAway(task.due_date) == 0){
            overdueTasksQueue.push(task);
        }
    })
}
const daysAway = (date) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

module.exports = priorityCron;