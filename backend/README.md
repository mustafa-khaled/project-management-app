# Modern Node.js Backend (Mongoose Edition)

A professional, scalable, and type-safe Node.js backend setup using Express, TypeScript, and Mongoose.

## Features

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Validation**: [Zod](https://zod.dev/) (Schema-based validation)
- **Logging**: [Winston](https://github.com/winstonjs/winston) & [Morgan](https://github.com/expressjs/morgan)
- **Security**: [Helmet](https://helmetjs.github.io/), [Cors](https://github.com/expressjs/cors)
- **Error Handling**: Centralized error handling and async error wrapping

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file (one has been created for you) and update your MongoDB URI in `DATABASE_URL`.

### 3. Run Development Server

```bash
pnpm run dev
```

### 4. Build for Production

```bash
pnpm run build
pnpm start
```

## Directory Structure

- `src/config`: Database connection and other configurations.
- `src/controllers`: Request handlers.
- `src/middlewares`: Security, auth, and error handling.
- `src/models`: Mongoose models and interfaces.
- `src/routes`: API route definitions.
- `src/services`: Business logic.
- `src/utils`: Helper functions and utilities.

## Scripts

- `pnpm run dev`: Start dev server with hot reload.
- `pnpm run build`: Compile TypeScript to JavaScript.
- `pnpm run lint`: Run ESLint.
- `pnpm run format`: Format code with Prettier.
- `pnpm run test`: Run tests once.
- `pnpm run test:watch`: Run tests in watch mode.
- `pnpm run test:coverage`: Generate test coverage report.

## Testing Setup

- **Framework**: [Vitest](https://vitest.dev/)
- **Integration/E2E**: [Supertest](https://github.com/ladjs/supertest)
- **Database Mocking**: `mongodb-memory-server` provides a fresh, in-memory MongoDB instance for every test run, ensuring no side effects on your real database.
