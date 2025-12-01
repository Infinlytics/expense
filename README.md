# Expense Tracker

A simple, premium expense tracker application built with Next.js, Prisma, Neon (PostgreSQL), and NextAuth.js.

## Features

- **Dashboard**: Visualize your income, expenses, and balance.
- **Transactions**: Add and view income and expense records.
- **Authentication**: Secure signup and login.
- **Premium Design**: Modern UI with dark mode aesthetics.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Authentication**: NextAuth.js (v5 beta)
- **Styling**: Tailwind CSS

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file with `DATABASE_URL` and `AUTH_SECRET`.
4.  Run migrations:
    ```bash
    npx prisma db push
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser.
