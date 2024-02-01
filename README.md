# Task-management-server

## Manual Installation

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env
# open .env and modify the environment variables
```

## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

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

# Third Party Integrations
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MOBILE=
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
 |--.env                # Environment variables
 |--.gitignore          # Folders to ignore from upload to repository
 |--app.js              # App entry point
 |--db.js               # Database driver
 |--package-lock.json   # Dependency management
 |--package.json        # Repository metadata, dependencies
```
