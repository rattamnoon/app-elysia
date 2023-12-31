import { apollo, gql } from "@elysiajs/apollo";
import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { healthCheck, users } from "@/route";

const app = new Elysia();

app
  .use(bearer())
  .use(swagger({ path: "/docs" }))
  .get("/healthCheck", healthCheck)
  .use(users)
  .use(
    apollo({
      typeDefs: gql`
        type Book {
          title: String
          author: String
        }

        type Query {
          books: [Book]
        }
      `,
      resolvers: {
        Query: {
          books: () => {
            return [
              {
                title: "Elysia",
                author: "saltyAom",
              },
            ];
          },
        },
      },
      context: async ({ request }) => {
        const authorization = request.headers.get("Authorization");

        return {
          authorization,
        };
      },
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
