const Task = require('../../models/model.task.js');
const { loadData, saveData } = require('../../util/dataStructures.js');

// Load data on initialization
// (async()=> await console.log(loadData()));

const priorityCron = async () => {
  console.log(`-----------------Cron job for priority update-------------------`)
  var {tasksList, overdueTaskQueue} = loadData();
  try{
      var pendingTasks = await Task.find({archived:false, status: { $ne: 'DONE' }, priority: { $ne: 0 }});

        overdueTaskQueue.push(...tasksList);
        tasksList.length = 0;
    
      for(const task of pendingTasks){
        if ([1, 3, 5].includes(daysAway(task.due_date))) {
          task.priority -= 1;
          await task.save();
          if (task.priority === 0) tasksList.push(task);
        }
      };
      // Save data after processing
      await saveData({tasksList, overdueTaskQueue});
  }
  catch(error){
    console.error(error)
  }
    console.log(`-----------------Priority update completed-------------------`)    
};

const daysAway = (date) => {
  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = priorityCron;
