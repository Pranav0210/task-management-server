const fs = require('fs');

const dataFilePath = `${__dirname}\\data.json`;

let tasksList = [];
let overdueTaskQueue = [];

function loadData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    tasksList = parsedData.tasksList || [];
    overdueTaskQueue = parsedData.overdueTaskQueue || [];
  } catch (error) {
    console.error('Error loading data:', error.message);
  }
}

function saveData() {
  const dataToSave = JSON.stringify({ tasksList, overdueTaskQueue }, null, 2);
  fs.writeFileSync(dataFilePath, dataToSave);
}

module.exports = {
  tasksList,
  overdueTaskQueue,
  loadData,
  saveData,
};
