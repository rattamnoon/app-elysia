import { Elysia } from "elysia";
import { Op } from "sequelize";

import User from "@/database/models/User.model";
import middleware from "@/utils/middleware";

const signIn = async ({ body }: { body: User }) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.email }],
    },
    attributes: ["username", "email"],
  });

  if (!user) {
    return `Username or email not found`;
  }

  const password = body.password;
  const hash = user.password!;

  const isMatch = await Bun.password.verify(password, hash);

  if (!isMatch) {
    return `Password is incorrect`;
  }

  return user;
};

const signUp = async ({ body }: { body: User }) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.email }],
    },
    attributes: ["username", "email"],
  });

  if (user) {
    return `Username or email already exists`;
  }

  const username = body.username;
  const password = body.password;
  const email = body.email;

  const argonHash = await Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 4,
    timeCost: 3,
  });

  try {
    const createUser = await User.create({
      username,
      password: argonHash,
      email,
    });

    return createUser;
  } catch (error) {
    return error;
  }
};

const profile = async ({ body }: { body: User }) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.email }],
    },
  });

  if (!user) {
    return `Username or email not found`;
  }

  return user;
};

const users = new Elysia({ prefix: "/user" })
  .post("/sign-in", () => signIn, {
    beforeHandle: middleware,
  })
  .post("/sign-up", () => signUp, {
    beforeHandle: middleware,
  })
  .post("/profile", profile, { beforeHandle: middleware });

export default users;
