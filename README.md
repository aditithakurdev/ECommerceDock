# ECommerceDock
ECommerceDock is a containerized eCommerce backend built with Node.js and Express, deployed via Docker. It offers secure REST APIs for products, orders, users, and payments, ensuring scalability, easy integration, and consistent performance across environments.

# Project Structure
my-project/
│── src/
│   ├── config/         # DB connection config
│   ├── routes/         # Express routes
│   ├── controllers/    # Route handlers
│   ├── models/         # Database models (using Prisma or Sequelize)
│   ├── index.ts        # App entry point
│── .env                # Environment variables
│── .gitignore
│── package.json
│── tsconfig.json
│── README.md


# ECommerceDock

A basic Node.js + TypeScript + PostgreSQL backend.

## 🚀 Tech Stack
- Node.js
- TypeScript
- Express
- PostgreSQL (via Prisma ORM)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/aditithakurdev/ECommerceDock.git
cd ECommerceDock

# Install dependencies
npm install
