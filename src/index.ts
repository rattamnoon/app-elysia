import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import axios from "axios";
import { Elysia } from "elysia";

import { healthCheck, users } from "@/route";
import { yoga } from "@elysiajs/graphql-yoga";

import User from "@/database/models/User.model";
import { loaders } from "@/utils/loader";
import Amphure from "./database/models/Amphure.model";
import Province from "./database/models/Province.model";
import Tambon from "./database/models/Tambon.model";

const app = new Elysia();

app
  .use(bearer())
  .use(swagger({ path: "/docs" }))
  .get("/", () => {
    return "check /docs for documentation";
  })
  .use(healthCheck)
  .use(users)
  .use(
    yoga({
      typeDefs: /* GraphQL */ `
        type Query {
          allUsers: [User!]!
          getUser(id: String!): User!

          allProvinces: [Province!]!
        }

        type Mutation {
          createUser(email: String!, password: String!): User!
          updateUser(id: String!, email: String!, password: String!): User!
          deleteUser(id: String!): Boolean!

          createProvince: [Province!]!
        }

        type User {
          id: ID!
          email: String!
        }

        type Province {
          id: Int!
          nameThai: String!
          nameEng: String!
        }

        type Amphure {
          id: Int!
          nameThai: String!
          nameEng: String!
          provinceId: Int!
        }
      `,
      context: {
        loaders,
      },
      useContext(_) {},
      resolvers: {
        Query: {
          allUsers: async (parent, args) => {
            const users = await User.findAll();

            return users;
          },
          getUser: async (_, { id }, { loaders }) => {
            const user = await loaders.userLoader.load(id);

            if (!user) {
              throw new Error("User not found");
            }

            return user;
          },
          allProvinces: async () => {
            const provinces = await Province.findAll();

            return provinces;
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

            try {
              const user = await User.create({ email, password: argonHash });

              user.password = "";

              return user;
            } catch (error) {
              throw new Error("Error creating user");
            }
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

            try {
              user.email = email;
              user.password = argonHash;

              await user.save();

              return user;
            } catch (error) {
              throw new Error("Error updating user");
            }
          },
          deleteUser: async (_, { id }) => {
            const user = await User.findByPk(id);

            if (!user) {
              throw new Error("User not found");
            }

            try {
              await user.destroy();

              return true;
            } catch (error) {
              throw new Error("Error deleting user");
            }
          },
          createProvince: async () => {
            const mainUrl =
              "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json";

            const resuts = await axios.get(mainUrl, { responseType: "json" });

            const provinces = resuts.data.map((province: any) => ({
              id: province.id,
              nameThai: province.name_th,
              nameEng: province.name_en,
              amphures: province.amphure.map((amphure: any) => ({
                id: amphure.id,
                nameThai: amphure.name_th,
                nameEng: amphure.name_en,
                tambons: amphure.tambon.map((tambon: any) => ({
                  id: tambon.id,
                  nameThai: tambon.name_th,
                  nameEng: tambon.name_en,
                  zipCode: tambon.zip_code,
                })),
              })),
            }));

            const data = await Province.bulkCreate(provinces, {
              include: [
                {
                  model: Amphure,
                  as: "amphures",
                  include: [{ model: Tambon, as: "tambons" }],
                },
              ],
            });

            return data;
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
