import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { healthCheck, users } from "@/route";
import { yoga } from "@elysiajs/graphql-yoga";

const app = new Elysia();

app
  .use(bearer())
  .use(swagger({ path: "/docs" }))
  .use(healthCheck)
  .use(users)
  .use(
    yoga({
      typeDefs: /* GraphQL */ `
        type Query {
          hi: String
        }
      `,
      resolvers: {
        Query: {
          hi: () => "Hello from Elysia",
        },
      },
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
