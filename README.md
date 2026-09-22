# School API project

This repository contains a beginner-friendly Express 5 API backed by PostgreSQL and Prisma, plus a plain HTML/CSS/JavaScript browser console for trying every route.

## Project layout

- `backend/` — Express server, Prisma schema/migrations, authentication, users, products, categories, brands, cart, orders, and admin routes.
- `front-end/` — dependency-free API testing console served on port `3008`.
- `docs/diagrams.md` — Mermaid diagrams for the architecture and main request flows.

## Requirements

- Node.js 24.11 or newer
- PostgreSQL
- A backend `.env` file containing `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT`

Example:

```env
PORT=3005
DATABASE_URL="postgresql://postgres:password@localhost:5432/prisma-shop?schema=public"
JWT_SECRET="replace-this-secret"
```

## Run locally

Start the API:

```bash
cd backend
npm install
npm start
```

Start the browser console in a second terminal:

```bash
cd front-end
npm start
```

Open <http://localhost:3008>. Choose a route preset, edit its values, and send the request to the API at <http://localhost:3005>. Successful login stores the JWT in the browser so it can be attached to later requests.

## Useful checks

```bash
cd front-end
npm test
npm run check

cd ../backend
npm run db:validate
```

The API uses bcrypt-hashed passwords. New users are hashed automatically, and a legacy plain-text password is upgraded to a bcrypt hash after one successful login. Passwords are not returned by user list/detail responses.

## Main API groups

| Group | Routes |
| --- | --- |
| Authentication | `/auth/register`, `/auth/login`, `/auth/logout` |
| Users | `/users` and user ID operations |
| Catalog | `/products`, `/categories`, `/brands` |
| Shopping | `/cart`, `/order/checkout` |
| Admin | `/admin` |

See [the Mermaid diagrams](docs/diagrams.md) for the system overview and request flows.
