const express = require("express")
const cron = require('node-cron')
const cors = require('cors')
const helmet = require('helmet')
require("dotenv").config();
const {auth} = require('./middleware/auth')
const authRouter = require('./routes/route.auth')
const taskRouter = require('./routes/route.task')
const dbConnect = require('./db');
const {priorityCron} = require('./controllers/cron/priorityController')

const app = express()
cron.schedule('0 0 * * *', ()=>{
  console.log(`-----------------Cron job for priority update-------------------`)
  priorityCron();
})

app.use(cors())
app.use(helmet())
app.use(express.json());

app.use('/api/v1/auth', authRouter)
app.use(auth)
app.use('/api/v1/task', taskRouter)

const PORT = process.env.PORT;

async function start(){
  try {
    await dbConnect(process.env.MONGO_URI);
    // console.log(`Connection to DB established successfully...`)
    app.listen(PORT, () => console.log(`Server live... \nlistening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
}

start();