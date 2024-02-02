const taskPriority = (dueDate)=> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
  
    const timeDifference = taskDueDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    if (currentDate.getFullYear() === taskDueDate.getFullYear() &&
      currentDate.getMonth() === taskDueDate.getMonth()) {
    switch (true) {
      case daysDifference === 0:
        return 0; // Due date is today
      case daysDifference === 1:
        return 1; // Due date is between tomorrow and day after tomorrow
      case daysDifference <= 3:
        return 2; // Due date is within 3-4 days
      default:
        return 3; // Due date is within 5-7 days // Due date is 8 days or more
    }
  }else{
    return 3; // Due date is not within the current month
  }
}
module.exports = {
    taskPriority
}