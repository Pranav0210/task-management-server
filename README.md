# Task-management-server
Manage due tasks and receive voice call reminders. Built with Express.js and Twilio Voice.
## Manual Installation

Install the dependencies:

```bash
npm install
```

Set the environment variables and create required util file. (run below commands *as they are* in the root directory)

```bash
touch .env
cd util
touch data.json
# open .env and modify the environment variables
```

## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Cron Logic](#cron-logic)

## Commands

Running in development:

```bash
npm start
# or
npm run dev
```
Running in production:

```bash
# build
npm run build
# start
npm run prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
# Port
PORT = # default 3000

# URL of the Mongo DB
MONGO_URI = 

# JWT secret
JWT_SECRET =
# Third Party Integrations
TWILIO_ACCOUNT_SID =
TWILIO_AUTH_TOKEN =
TWILIO_MOBILE =
```

## Project Structure

```
\                       # Root folder
 |--controllers\        # Controllers
    |--cron
 |--middleware\         # Custom express middlewares
 |--models\             # Mongoose models
 |--routes\             # Routes
 |--test\               # Unit Tests and Load Tests
 |--util\               # Utility functions
   |--errors         
 |--.env                # Environment variables
 |--.gitignore          # Folders to ignore from upload to repository
 |--app.js              # App entry point
 |--db.js               # Database driver
 |--package-lock.json   # Dependency management
 |--package.json        # Repository metadata, dependencies
```

## API Endpoints

List of available routes:

**Auth routes**: `api/v1/auth`
- `POST /register` - create user and return user_id
- `POST /login` - Logs user in by returning Bearer token
- `GET /logout` - Logout

**Task routes**: `api/v1/task`
- `GET /user-tasks/:user` - Get all tasks belonging to user
- `GET /user-subtasks/:user` - Get all subtasks belonging to user
- `POST /create-task` - Create new task
- `POST /create-subtask` - Create new sub-task
- `PUT /update-task/:user` - Update status of due_date of task belonging to user
- `PUT /update-subtask/:user` - Update status of sub-task belonging to user
- `DELETE /delete-task/:task` - Soft deletion of task
- `DELETE /delete-subtask/:task` - Soft deletion of sub-task

## Cron Logic

The use case stays minimal hence its requirements of data structures is kept simple. This use case implements two cron jobs crucial to the main functionality of the project - its essense :

1. `Priority update` - This cron is scheduled to run every midnight at 0000 Hrs to update the priority of each task which is calculated on the basis of the proximity of due date. The logic updates all the task documents and stores the tasks which are due that day itself; locally. Storage can make use of a cache, however this project makes use of simple file storage. This is *done to avoid the overhead of re-fetching the overdue tasks*. Ones remaining in the file at the end of the day are simply passed on to an overdue queue and handed over to the next cron job.

2. `Overdue reminder via call` - This job is scheduled to run during the working hours for effective reminders. Fetches overdue tasks from the queue in FIFO order and calls users associated serially in their priority order until a call is answered or all 3 users are exhausted. In the second case the task is marked for deletion. *Assumes that the queue is exhaustive and is emptied during the working hours.*
