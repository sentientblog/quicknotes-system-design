
# QuickNotes System Design

QuickNotes is a notes application project that demonstrates how a browser-based client communicates with an API and how a production service could be designed to support one million registered users.

The project includes a working practice API client using JSONPlaceholder and three design documents covering the production REST API, relational data model, and system architecture.

## Project structure

- `index.html` — API client interface.
- `api.js` — GET, POST, and DELETE requests, validation, and error handling.
- `style.css` — Responsive styling and success/error states.
- `docs/api-design.md` — Production REST API specification.
- `docs/data-model.md` — Database schema, relationships, queries, and indexes.
- `docs/architecture.md` — Requirements, capacity estimates, architecture, request flows, and trade-offs.

## How to run the API client

1. Clone or download this repository.
2. Open `index.html` in a browser, or serve the repository using a local development server.
3. Click **Load notes** to retrieve the first 10 posts from JSONPlaceholder.
4. Use the form to create a note.
5. Use a note's **Delete** button to remove it from the current client-side list.

The client requires an internet connection to reach JSONPlaceholder. No backend installation is required for this demonstration.

**Important limitation:** JSONPlaceholder is a practice API. POST and DELETE requests simulate server operations but do not permanently change the server's dataset. Created notes remain in the current browser list until the list is reloaded; deleted notes are removed from the current list after a successful response.

## Design documents

- [REST API design](docs/api-design.md)
- [Data model](docs/data-model.md)
- [System architecture](docs/architecture.md)

## What I learned

- How to use asynchronous JavaScript and Fetch API requests to retrieve, create, and delete resources.
- How to validate user input, handle HTTP errors, and represent loading, success, error, and empty states.
- How RESTful endpoints and HTTP status codes help define a clear API contract.
- How primary keys, foreign keys, join tables, and indexes support relational data.
- How caching, load balancing, read replicas, and queues can help a service scale, and what trade-offs they introduce.
