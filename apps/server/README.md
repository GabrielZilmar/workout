# 🏋️‍♂️ Workout App API

Welcome to the Workout App API! This API allows users to register, log in, create workouts, set routines, and manage exercises. The app is built using Nest.js and PostgreSQL, following the principles of Domain-Driven Design (DDD).

## Features ✨

- **User Authentication**: Users can register and log in securely to the application.
- **Workout Creation**: Users can create custom workouts with exercises and sets.
- **Routine Setting**: Users can set their workouts as routines for regular use.
- **Public Workouts**: Users can choose to make their workouts public.
- **Admin Privileges**: Admins can manage exercises and muscle groups.

## Technologies Used 💻

- **Nest.js**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database system.
- **TypeORM**: An ORM (Object-Relational Mapping) library for TypeScript and JavaScript.
- **JWT (JSON Web Tokens)**: For secure user authentication.

## Installation 📦

1. **Clone the repository:**

```bash
 git clone https://github.com/GabrielZilmar/workout.git
```

**Install dependencies:**

```bash
cd workout-app-api
npm install
```

**Set up environment variables: 🤫**

Create a .env file in the root directory and define the following variables:

```config
PORT=3030

DATABASE_HOST=your_db_host
DB_PORT=5432
USERNAME=your_db_username
PASSWORD=your_db_password
DATABASE=workout

PASSWORD_SALT=number_of_password_salt

JWT_SECRET=your_jwt_secret

MAIL_HOST=
EMAIL_PORT=
EMAIL_SERVICE=your_email_service
EMAIL_SENDER=your_email_to_use_as_sender
EMAIL_PASSWORD=your_email_sender_password

ALGORITHM=cipher_allowed_algorithm
ALGORITHM_SECURITY_KEY=algorithm_key
ALGORITHM_IV=initialization_vector_for_the_algorithm

VERIFY_EMAIL_URL=CLIENT_URL/verify-email
RECOVER_PASSWORD_URL=CLIENT_URL/recover-password

ADMIN_EMAIL=admin_user_email
ADMIN_PASSWORD=admin_password
ADMIN_USERNAME=admin_username
```

**Database setup:**

Ensure you have PostgreSQL installed and running. Create a database named workout_app or replace the DATABASE_URL in your .env file with your desired database URL.

**Run migrations:**

```bash
npm run migration:up
```

**Start the server:**

```bash
npm run start:dev
```
