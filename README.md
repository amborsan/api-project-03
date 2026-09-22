# School API & Route Testing Console

A beginner-friendly full-stack API project built with Express, Prisma, PostgreSQL, and a dependency-free browser testing console. The project is designed for learning, demonstrating, and manually testing authentication, users, catalog data, shopping flows, and admin access.

## What this project includes

### Backend API

- Express 5 HTTP server
- Prisma 7 database access with PostgreSQL
- JWT authentication with bcrypt password hashing
- CORS configured for the local browser console
- Rate limiting and JSON request parsing
- User, product, category, brand, cart, order, and admin routes
- Prisma migrations and schema validation

### Front-end API console

- Plain HTML, CSS, and JavaScript
- No framework, bundler, or front-end dependency
- Editable method, endpoint, JSON body, and JWT fields
- Presets for all registered API routes
- Formatted JSON, text, and empty-response output
- HTTP status and request duration display
- JWT persistence through `localStorage`
- Small dependency-free Node static server

## Repository structure

```text
.
├── backend/
│   ├── prisma/              # Schema and database migrations
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, and error middleware
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # API entry point
│   ├── tests/               # Backend regression tests
│   └── package.json
├── front-end/
│   ├── index.html           # Browser console markup
│   ├── style.css            # Console styling
│   ├── app.js               # Browser interactions
│   ├── api.js               # Route presets and fetch helpers
│   ├── server.js            # Static file server
│   └── test/                # Front-end tests
├── docs/
│   └── diagrams.md          # Mermaid architecture and flow diagrams
└── README.md
```

## Technology stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js 24.11 or newer |
| API | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT and bcrypt |
| Validation | Zod |
| Browser console | HTML, CSS, JavaScript |
| Tests | Node.js built-in test runner |

## Prerequisites

- Node.js 24.11 or newer
- npm
- PostgreSQL running locally or on an accessible server
- Git, if cloning the repository

## Environment configuration

Create `backend/.env`:

```env
PORT=3005
DATABASE_URL="postgresql://postgres:password@localhost:5432/prisma-shop?schema=public"
JWT_SECRET="replace-this-with-a-long-random-secret"
```

Keep `.env` private. It is ignored by Git and must not be committed.

## Database setup

From the backend directory:

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:validate
```

`db:migrate` applies the checked-in Prisma migrations to the configured database. Use `npm run db:studio` to inspect records through Prisma Studio.

## Running the project

Start the API in one terminal:

```bash
cd backend
npm start
```

The API runs at <http://localhost:3005>.

Start the browser console in a second terminal:

```bash
cd front-end
npm start
```

Open <http://localhost:3008>. The browser console sends requests to port `3005`, so keep both servers running while testing.

## Using the browser console

1. Select a route preset.
2. Review or edit the HTTP method and endpoint.
3. Edit the JSON body when the route accepts one.
4. Send a JWT when testing protected routes.
5. Click **Send request**.
6. Inspect the status, duration, and formatted response.

After a successful login, the returned token is saved in browser storage and can be attached to later requests. Use **Clear token** to remove it.

The console includes presets for authentication, users, products, categories, brands, cart, checkout, and the protected admin dashboard.

## API route overview

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/logout` |
| Users | `GET/POST /users`, `GET/PUT/PATCH/DELETE /users/:id` |
| User aliases | `POST /users/register`, `POST /users/login`, `GET /users/logout` |
| Products | `GET/POST /products` |
| Categories | `GET/POST /categories`, `GET /categories/:slug/products` |
| Brands | `GET/POST /brands`, `GET /brands/:id` |
| Cart | `GET /cart/:userId`, `POST /cart` |
| Orders | `POST /order/checkout` |
| Admin | `GET /admin` with an administrator JWT |

## Authentication and password behavior

Registration hashes passwords with bcrypt before saving them. User creation and update routes also hash submitted passwords. Login returns a JWT containing the user ID and role.

Legacy records that still contain a plain-text password can log in once; the API upgrades that password to a bcrypt hash after successful verification. New records should always be created through the hashed routes.

User list and detail responses omit the password field. Never share passwords, JWTs, database URLs, or JWT secrets in screenshots, issues, or commits.

## Testing and validation

```bash
# Backend
cd backend
npm test
npm run db:validate

# Front end
cd ../front-end
npm test
npm run check
```

The tests cover route presets, request construction, token behavior, static-file serving, path traversal protection, CORS configuration, password hashing, legacy password upgrades, product relations, route ordering, and validation responses.

## Troubleshooting

### `DATABASE_URL is missing`

Confirm that `backend/.env` exists and contains `DATABASE_URL`. Start commands from the `backend` directory.

### The browser reports a CORS error

Confirm that the front end is opened at `http://localhost:3008`, not directly from a `file://` URL. Restart the backend after changing CORS settings.

### Login returns `Invalid email or password.`

Check the email and password carefully. If the user was created manually, ensure the stored password is valid or allow one successful legacy-password login so the API can upgrade it.

### Products or other routes return a database error

Confirm that PostgreSQL is running, `DATABASE_URL` points to the correct database, and migrations have been applied with `npm run db:migrate`.

### Port already in use

Stop the process using port `3005` or `3008`, or change `PORT` for the backend. The front-end server reads its port from `PORT` and defaults to `3008`.

## Documentation

See [docs/diagrams.md](docs/diagrams.md) for Mermaid diagrams showing the system architecture, browser-to-API request lifecycle, registration and login flow, and API route groups.

The front-end-specific instructions are also available in [front-end/README.md](front-end/README.md).
