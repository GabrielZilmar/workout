# 🏋️‍♂️ Workout APP

Welcome to Workout APP! This app allows users to create an account register workouts, creating routines and checking public routine created from other users!
Admin can create, modify, and delete exercises.

The App have an section to see user's workouts, public workout's, and the platform exercises.

## Technologies Used 💻

- **Turborepo**: Turborepo is a high-performance build system for JavaScript and TypeScript codebases. It is designed for scaling monorepos and also makes workflows in single-package workspaces faster, too.
- **Husky**: Husky is a tool that enables Git hooks to enforce code quality checks and automate tasks during version control operations.
- **Eslint**: ESLint is a static code analysis tool for identifying and fixing problems in JavaScript code, helping enforce coding standards and improve code quality.

### Server ⚙️

- **Nest.js**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database system.
- **TypeORM**: An ORM (Object-Relational Mapping) library for TypeScript and JavaScript.
- **JWT (JSON Web Tokens)**: For secure user authentication.

### Client 🌐

- **Next.js**: A React framework for building fast, server-rendered web applications with minimal configuration.
- **react-query**: A library for managing server state in React applications, providing tools for fetching, caching, and updating data.
- **zustand**: A small, fast state-management library for React, offering a simple and flexible API for managing global state.

### UI 🎨

- **Tailwind**: A utility-first CSS framework for rapidly building custom user interfaces with pre-defined, low-level utility classes.
- **Shadcn**: A collection of accessible and customizable UI components for building modern web applications with React and Tailwind CSS.
- **Storybook**: A tool for developing and testing UI components in isolation, enabling developers to build, view, and interact with components independently of the main application.

## Installation 📦

1. **Clone the repository:**

```bash
  git clone https://github.com/GabrielZilmar/workout.git
```

Or using ssh:

```bash
  git clone git@github.com:GabrielZilmar/workout.git
```

**Install dependencies:**

```bash
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

Make sure PostgreSQL is installed and running. Create a database that matches the name in your `.env` file under `DATABASE`, or update the `DATABASE` configuration in your `.env` file with your preferred database URL.

**Run migrations:**

```bash
  cd apps/server
  npm run migration:up
```

## Usage 🔄

In the root dir, run:

```bash
  npm run dev
```
