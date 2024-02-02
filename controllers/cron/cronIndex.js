const cron = require('node-cron')
const {priorityCron} = require('./priorityController')
const {reminderCron} = require('./reminderController')

function cronBootstrap() {
  console.log("\nBootstrapping cron jobs...")
  try{
    cron.schedule('0 0 * * *', ()=>{
      console.log(`-----------------Cron job for priority update-------------------`)
      priorityCron();
    },{
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })
    console.log("Priority update [ok]------------------ 1/2")
  }
  catch(err){
    console.err("Priority update [failed]------------------ 1/2")
  }
    
    try{
      cron.schedule('0 10 * * *', ()=>{
      console.log(`----------------Cron job for overdue reminders------------------`)
      reminderCron();
    },{
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })
    console.log("Overdue Reminder [ok]------------------ 2/2")
  }
  catch(err){
    console.err("Overdue Reminder [failed]------------------ 2/2")
  }
  console.log("Cron jobs running\n")
}

module.exports = cronBootstrap;