const {overdueTaskQueue} = require('../../util/dataStructures');

const reminderCron = async() => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
    
  overdueTaskQueue.forEach(async task => {
    for(i=0; i<task.users.length; i++){
      phone_number = task.users[i].phone_number;
      
      var isCallSuccessful = false; //for now
      await client.calls
            .create({
              url: 'https://demo.twilio.com/welcome/voice/',
              // url: 'http://localhost:5000/api/v1/twilio/call-user',
              to: '+918629907217',
              from: process.env.TWILIO_MOBILE
             })
            .then(call => {
              console.log(call.status)
              if(call.status === 'in-progress' || call.status === 'completed'){
                isCallSuccessful = true;
              }
            });
      //if call is successful, remove the task from the queue else move on to next related user
      if(isCallSuccessful){
        overdueTaskQueue.splice(overdueTaskQueue.indexOf(task), 1);
        break;
      }
    }
  });
}
reminderCron();
module.exports =  reminderCron;