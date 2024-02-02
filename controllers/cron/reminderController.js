// const {overdueTaskQueue} = require('../../util/dataStructures');
const {saveData,loadData} = require('../../util/dataStructures');
const User = require('../../models/model.user')

const reminderCron = async() => {
  console.log(`----------------Cron job for overdue reminders------------------`)
  try{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    
    var {overdueTaskQueue} = await loadData()

    for(task of overdueTaskQueue) {
      for(i=0; i<task.users.length; i++){
        const user = await User.findOne({_id:task.users[i]._id});

        var isCallSuccessful = false; 
        var call = await client.calls.create({
                url: 'https://demo.twilio.com/welcome/voice/',
                // url: 'http://localhost:5000/api/v1/twilio/call-user',
                to: `${user.phone_number}`,
                from: `${process.env.TWILIO_MOBILE}`
              })

        const sid = call.sid;
        if(call.status === 'queued')
         await delay(35000)
        
        call = await client.calls(sid).fetch();
        if(call.status === 'in-progress' || call.status === 'completed'){
            isCallSuccessful = true;
        }
      };
        // if call is successful, remove the task from the queue else move on to next related user
        // in case no one picks up remove the task
      if(isCallSuccessful || i === 2){
        overdueTaskQueue.splice(overdueTaskQueue.indexOf(task), 1);
        break;
      }
    }
  }
  catch(error){
    console.log(error)
  }
  await saveData({overdueTaskQueue});
}
function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports =  reminderCron;