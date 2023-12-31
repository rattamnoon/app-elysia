import Dataloader from "dataloader";

import User from "@/database/models/User.model";

export const createLoader = <T>(
  batchFn: (keys: readonly string[]) => Promise<T[]>
) => new Dataloader<string, T>(batchFn);

const userLoader = createLoader<User>(async (keys) => {
  const users = await User.findAll({ where: { id: keys } });

  const userMap: Record<string, User> = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return keys.map((key) => userMap[key]);
});

const usersLoader = createLoader<User[]>(async (keys) => {
  const users = await User.findAll({ where: { id: keys } });

  const userMap: Record<string, User[]> = {};

  users.forEach((user) => {
    userMap[user.id] = [user];
  });

  return keys.map((key) => userMap[key]);
});

export const loaders = {
  userLoader,
  usersLoader,
};
