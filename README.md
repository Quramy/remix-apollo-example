# Remix Apollo Example

This repo supports the following feature:

- Server Side Rendering
- Client Side Routing
- Navigation with prefetching

## Getting started

```sh
npm i
cp .env.example .env

# Start PostgreSQL DB
docker compose up -d

npm run migrate:dev

npm run seed
```

### Start dev server

```sh
npm run dev
```

```sh
open http://localhost:5137
```

And GraphQL playground is served as http://localhost:5137api/graphql

### Start prod server

```sh
npm run build
npm start
```

```sh
open http://localhost:3000
```
