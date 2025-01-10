# Template for a Next.js + Auth.js + Prisma project

Starter project with built-in Authentication: Social (Google, Github), Email + Password and Passkey (experimental) using the latest version of NextAuth.js (Auth.js) version 5 (beta).

![MIT License](https://img.shields.io/badge/license-MIT-blue)

## NextJS

![Next.js](https://img.shields.io/badge/next.js-v14.2.16-blue)

## Database

- PostgreSQL
- Database Object Relational Mapper (ORM): [Prisma](https://www.prisma.io/) ![Prisma](https://img.shields.io/badge/prisma-v5.19.1-blue)

## Authentication

- [NextAuth.js v5 (Auth.js)](https://authjs.dev/) ![NextAuth.js](https://img.shields.io/badge/next--auth-v5.0.0--beta.25-blue)
- Password encryption: bcryptjs ![bcryptjs](https://img.shields.io/badge/bcryptjs-v2.4.3-blue)

## Forms

- [React Hook Form](https://react-hook-form.com/) ![React Hook Form](https://img.shields.io/badge/react--hook--form-v7.53.1-blue)
- Validation with [Zod](https://zod.dev/) ![Zod](https://img.shields.io/badge/zod-v3.23.8-blue)
- Password strength check with [zxcvbn](https://www.npmjs.com/package/zxcvbn) ![zxcvbn](https://img.shields.io/badge/zxcvbn-v4.4.2-blue)

## Styling

- TailwindCSS ![TailwindCSS](https://img.shields.io/badge/tailwindcss-v3.4.1-blue),
- NextUI ![NextUI](https://img.shields.io/badge/nextui-v2.4.8-blue),
- React Icons ![React Icons](https://img.shields.io/badge/react--icons-v5.3.0-blue)

## Miscellaneous

- Email: [Resend](https://resend.com)
- Notifications: [react-toastify](https://www.npmjs.com/package/react-toastify) ![react-toastify](https://img.shields.io/badge/react--toastify-v10.0.6-blue)

---

# Registration and Login Workflows

The images below provide a high-level overview of the authentication workflows. For specific details, please examine the code.

https://www.canva.com/design/DAGUfcU8lpo/MQss79BqNjrHhH-93eGBWQ/view?utm_content=DAGUfcU8lpo&utm_campaign=share_your_design&utm_medium=link&utm_source=shareyourdesignpanel

## Social Registration / Login

![Social-Registration-Login](readme-images/Auth-Social-Registration-Login.webp)

## Registration With Email + Password / Set New Password

![Password-Registration](readme-images/Auth-Password-Registration.webp)

## Login With Email

![Login-With-Email](readme-images/Auth-Email-Login.webp)


---

# How To Use This Template

## First Steps

1. Click the 'Use this Template' button and choose 'Create a new repository'.
2. Clone the project to create a local version.
3. Run `npm install` to install all dependencies.
4. Verify that all dependencies are installed without errors.

## Environment Setup

1. Rename `.env.example` to `.env`
2. Add the necessary credentials to the `.env` file.
3. Run `npx auth secret` and verify that `.env.local` is created with `AUTH_SECRET`.

## Database Setup

The easiest way to set up a postgres database is to use a cloud service like NEON or Clever Cloud. In this case, you will need to update the `DATABASE_URL` in the `.env` file. Another option is to set up a local database server, using Docker, for which there is a docker-compose file in the project. 

To use the local database server, follow the steps below.
1. If you don't have Docker installed, you can install it from [here](https://docs.docker.com/get-docker/).
2. Start the Docker container for the PostgreSQL database using `docker compose up -d`.
3. Verify that the PostgreSQL container is running.

## Prisma Client Generation

1. Run `npx prisma generate`.
2. Verify that the Prisma client is generated without errors.

## Load Prisma Schema into the Database

1. Run `npx prisma db push`.
2. Verify that the schema is loaded to the database without errors.

## Open Prisma Studio

1. Run `npx prisma studio`.
2. Verify that Prisma Studio opens at `http://localhost:5555`.

## Start Development Server

1. In a new terminal tab, run `PORT=3001 npm run dev`.
2. Verify that the development server starts without errors and the app is running at `http://localhost:3001`.

## Cypress Testing

1. Make sure that the docker container is running (if you're using one) as well as the prisma client has been generated.
2. Make sure that the development server is running.
3. Run `npm run cy:run` to run the Cypress tests in the terminal.
4. Alternatively, run `npm run cy:open` to open the Cypress GUI and run the tests.

# How to contribute to this project

Contributions welcome! If you would like to help improve this project, please get in touch!

---

---

# Notes

- Linking OAuth accounts with existing accounts: https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option

---
---

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
