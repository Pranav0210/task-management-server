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

    return({tasksList,overdueTaskQueue})
  } catch (error) {
    console.error('Error loading data:', error.message);
  }
}

function saveData(data) {
  try{
      const {tasksList, overdueTaskQueue} = data
    if(!tasksList)
      tasksList = loadData().tasksList;
    const dataToSave = JSON.stringify({ tasksList, overdueTaskQueue }, null, 2);
    fs.writeFileSync(dataFilePath, dataToSave);
  }
  catch(error){
    console.log("Error saving data: ", error.message)
  }
}

module.exports = {
  loadData,
  saveData,
};
