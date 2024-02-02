const { Task } = require('../../models/model.task.js');
const { tasksList, overdueTaskQueue, loadData, saveData } = require('../../util/dataStructures.js');

// Load data on initialization
loadData();

const priorityCron = async () => {
  const pendingTasks = await Task.find({ status: { $ne: 'DONE' } });
  overdueTaskQueue.push(...tasksList);

  pendingTasks.filter((task) => daysAway(task.due_date) == 0);
  pendingTasks.forEach(async (task) => {
    if ([0, 1, 3, 5].includes(daysAway(task.due_date))) {
      task.priority -= 1;
      await task.save();
      if (task.priority === 0) tasksList.push(task);
    } else if (daysAway(task.due_date) === 0) {
      overdueTaskQueue.push(task);
    }
  });

  // Save data after processing
  saveData();
};

const daysAway = (date) => {
  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = priorityCron;
