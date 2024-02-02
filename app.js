const express = require("express")
const cron = require('node-cron')
const cors = require('cors')
const helmet = require('helmet')
require("dotenv").config();
const {isAuth} = require('./middleware/auth')
const authRouter = require('./routes/route.auth')
const taskRouter = require('./routes/route.task')
const twilioRouter = require('./routes/route.twilio')
const dbConnect = require('./db');
const cronBootstrap = require('./controllers/cron/cronIndex')

const app = express()
cronBootstrap();

app.use(cors())
app.use(helmet())
app.use(express.json());

app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/twilio', twilioRouter)
// app.use(isAuth)
app.use('/api/v1/task', isAuth,taskRouter)

const PORT = process.env.PORT;

async function start(){
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server live [v1.0.0] \nlistening on port ${PORT}...`));

  } catch (error) {
    console.log(error);
  }
}

start();