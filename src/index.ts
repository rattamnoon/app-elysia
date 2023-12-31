import { apollo, gql } from "@elysiajs/apollo";
import bearer from "@elysiajs/bearer";
import { cron } from "@elysiajs/cron";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import sequelize from "@/database/sequelize";

const app = new Elysia();

app
  .use(bearer())
  .use(
    cron({
      name: "heartbeat",
      pattern: "*/10 * * * * *",
      run() {
        console.log("Heartbeat");
      },
    })
  )
  .get("/", ({ bearer }) => bearer, {
    beforeHandle({ bearer, set }) {
      if (bearer !== "Bearer xxxxx") {
        set.status = 400;
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;

        return "Unauthorized";
      }

      return "Hello Elysia";
    },
  })
  .get("/health", async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })
  .use(
    swagger({
      path: "/docs",
    })
  )
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
