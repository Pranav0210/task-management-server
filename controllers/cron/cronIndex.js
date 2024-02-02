const cron = require('node-cron')
const priorityCron = require('./priorityController')
const reminderCron = require('./reminderController')

function cronBootstrap() {
  console.log("\nBootstrapping cron jobs...")
  try{
    cron.schedule('0 0 * * *', priorityCron,
    {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })
    console.log("Priority update [ok]------------------ 1/2")
  }
  catch(error){
    console.log("Priority update [failed]------------------ 1/2")
    console.log(error)
  }
    
    try{
      cron.schedule('0 10 * * *', reminderCron,
      {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })
    console.log("Overdue Reminder [ok]------------------ 2/2")
  }
  catch(error){
    console.log("Overdue Reminder [failed]------------------ 2/2")
    console.log(error)
  }
  console.log("Cron jobs scheduled successfully\n")
}

module.exports = cronBootstrap;