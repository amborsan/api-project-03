# API testing front end

This is a small, dependency-free browser console for the Express API.

1. Start the backend (it needs PostgreSQL and the backend `.env` file):

   ```bash
   cd backend
   npm start
   ```

2. In another terminal, start this front end:

   ```bash
   cd front-end
   npm start
   ```

Open <http://localhost:3008>. Login responses save the JWT in the browser so it can be attached to later requests. Run `npm test` in this directory to run the front-end tests.
