# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

Env

```js
Authorization Bearer xxxxx
```

## Getting Started Run

### Run database and migrate

```shell
bun db:run
```

### Run seed

```shell
bun db:seed
```

```shell
# on docker container
DB_HOST=db

# on local
DB_HOST=localhost

DB_PORT=5432
DB_DATABASE=db
DB_USERNAME=user
DB_PASSWORD=password
DB_DIALECT=postgres
```
