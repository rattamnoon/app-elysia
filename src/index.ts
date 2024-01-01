import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { healthCheck, users } from "@/route";
import { yoga } from "@elysiajs/graphql-yoga";

import User from "@/database/models/User.model";
import { Loader, loaders } from "@/utils/loader";

import District from "./database/models/District.model";
import Province from "./database/models/Province.model";
import SubDistrict from "./database/models/SubDistrict.model";

const app = new Elysia();

type Context = {
  loaders: Loader;
};

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
          allDistricts: [District!]!
          allSubDistricts: [SubDistrict!]!
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

        type Province {
          id: Int!
          nameThai: String!
          nameEng: String!
          districts: [District!]!
        }

        type District {
          id: Int!
          nameThai: String!
          nameEng: String!
          provinceId: Int!
          province: Province!
          subDistricts: [SubDistrict!]
        }

        type SubDistrict {
          id: Int!
          nameThai: String!
          nameEng: String!
          districtId: Int!
          district: District!
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
          allDistricts: async () => {
            const districts = await District.findAll();

            return districts;
          },
          allSubDistricts: async () => {
            const subDistricts = await SubDistrict.findAll();

            return subDistricts;
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
          deleteUser: async (_, { id }, { loaders }) => {
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
        },
        Province: {
          districts(parent: Province, args: {}, { loaders }: Context) {
            const districts = loaders.districtsByProvinceLoader.load(parent.id);
            return districts;
          },
        },
        District: {
          province(parent: District, args: {}, { loaders }: Context) {
            return loaders.provinceLoader.load(parent.provinceId);
          },
          subDistricts(parent: District, args: {}, { loaders }: Context) {
            return loaders.subDistrictsByDistrictLoader.load(parent.id);
          },
        },
        SubDistrict: {
          district(parent: SubDistrict, args: {}, { loaders }: Context) {
            return loaders.districtLoader.load(parent.districtId);
          },
        },
      },
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
