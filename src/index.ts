import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { healthCheck, users } from "@/route";
import { yoga } from "@elysiajs/graphql-yoga";

import User from "@/database/models/User.model";

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
          allUsers: [User!]!
          getUser(id: String!): User!
        }

        type Mutation {
          createUser(email: String!, password: String!): User!
          updateUser(id: String!, email: String!, password: String!): User!
          deleteUser(id: String!): Boolean!
        }

        type User {
          id: ID!
          email: String!
        }
      `,
      context: {
        name: "Mobius",
      },
      useContext(_) {},
      resolvers: {
        Query: {
          hi: async (parent, args, context) => context.name,
          allUsers: async () => {
            const users = await User.findAll();
            return users;
          },
          getUser: async (_, { id }) => {
            const user = await User.findByPk(id);

            if (!user) {
              throw new Error("User not found");
            }

            return user;
          },
        },
        Mutation: {
          createUser: async (_, { email, password }) => {
            const userExists = await User.findOne({ where: { email } });

            if (userExists) {
              throw new Error("User already exists");
            }

            const argonHash = await Bun.password.hash(password, {
              algorithm: "argon2id",
              memoryCost: 4,
              timeCost: 3,
            });

            const user = await User.create({ email, password: argonHash });

            user.password = "";

            return user;
          },
          updateUser: async (_, { id, email, password }) => {
            const user = await User.findByPk(id);

            if (!user) {
              throw new Error("User not found");
            }

            const argonHash = await Bun.password.hash(password, {
              algorithm: "argon2id",
              memoryCost: 4,
              timeCost: 3,
            });

            user.email = email;
            user.password = argonHash;

            await user.save();

            return user;
          },
          deleteUser: async (_, { id }) => {
            const user = await User.findByPk(id);

            if (!user) {
              throw new Error("User not found");
            }

            await user.destroy();

            return true;
          },
        },
      },
      logging: "debug",
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
