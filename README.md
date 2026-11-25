This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Authentication uses Auth.js Credentials with MongoDB-backed users. Configure
`DATABASE_URL`, `AUTH_SECRET`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` in
your local `.env` file; `.env.example` lists the required variables. Generate a
random secret with `openssl rand -base64 32`. MongoDB must run as a replica set
for Prisma's transactional operations.
`AUTH_TRUST_HOST=true` enables the local server's host headers; configure your
deployment's trusted host or `AUTH_URL` for its actual origin.

Local MongoDB runs in the `mongodb` Docker container as the single-node replica
set `rs0`. Its existing database and configuration volumes are preserved, and
the replica-set keyfile is stored in the configuration volume. Start the
configured container with `docker start mongodb` when needed. The local
`DATABASE_URL` includes `replicaSet=rs0&directConnection=true`.

Production uses MongoDB Atlas. Set the production `DATABASE_URL` to your Atlas
`mongodb+srv://` connection string with the database name and credentials;
the local replica-set and direct-connection parameters are only for Docker.

Apply the schema and provision the administrator:

```bash
npm run db:push
npm run gen
npm run seed
```

The seed preserves existing accounts and passwords. Passwords are stored as
Argon2id hashes. Sign in at `/login`; successful login opens `/admin`, which
currently redirects to `/admin/products`. Only administrators can access admin
pages. Sessions expire after eight hours, and login allows ten attempts per
email in each fifteen-minute window, shared across server instances.

Auth behavior lives in `src/features/auth`. Forms use React Hook Form, and
client requests use React Query mutations. New admin pages and server
operations must call `requireAdmin()` from the auth feature's server module;
layout checks alone do not protect server entry points.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

