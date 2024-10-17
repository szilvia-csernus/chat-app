# Template for a Next.js + Auth.js + Prisma project

NextJS application

Styling: TailwindCSS, NextUI, React Icons
Forms: [React Hook Form](https://react-hook-form.com/), validation with [Zod](https://zod.dev/)
Authentication: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
Database: PostgreSQL
Database Object Relational Mapper (ORM): [Prisma](https://www.prisma.io/)
Password encryption: bcryptjs
Notifications: [react-tostify](https://www.npmjs.com/package/react-toastify)


# Instructions

Rename `.env.example` to `.env` and add credentials

Start the docker container for the postgres database:
`docker compose up -d`

Generate the prisma client:
`npx prisma generate`

Load Prisma schema to database:
`npx prisma db push`

Open Prisma Studio:
`npx prisma studio`

Start the development server:
`npm run dev`



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
