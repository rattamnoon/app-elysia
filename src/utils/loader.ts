import Dataloader from "dataloader";
import { groupBy, keyBy } from "lodash";

import District from "@/database/models/District.model";
import Province from "@/database/models/Province.model";
import SubDistrict from "@/database/models/SubDistrict.model";
import User from "@/database/models/User.model";

export type Loader = {
  userLoader: Dataloader<string, User>;
  usersLoader: Dataloader<string, User[]>;
  districtLoader: Dataloader<number, District>;
  districtsLoader: Dataloader<number, District[]>;
  districtByProvinceLoader: Dataloader<number, District>;
  districtsByProvinceLoader: Dataloader<number, District[]>;
  provinceLoader: Dataloader<number, Province>;
  subDistrictsByDistrictLoader: Dataloader<number, SubDistrict[]>;
};

export const createLoader = <T>(
  batchFn: (keys: readonly string[]) => Promise<T[]>
) => new Dataloader<string, T>(batchFn);

export const createManyLoader = <T>(
  batchFn: (keys: readonly string[]) => Promise<T[][]>
) => new Dataloader<string, T[]>(batchFn);

export const createNubmerLoader = <T>(
  batchFn: (keys: readonly number[]) => Promise<T[]>
) => new Dataloader<number, T>(batchFn);

const userLoader = createLoader<User>(async (keys) => {
  const users = await User.findAll({ where: { id: keys } });

  const userMap = keyBy(users, (item) => item.id);

  return keys.map((key) => userMap[key]);
});

const usersLoader = createLoader<User[]>(async (keys) => {
  const users = await User.findAll({ where: { id: keys } });

  const userMap = groupBy(users, (item) => item.id);

  return keys.map((key) => userMap[key]);
});

const districtLoader = createNubmerLoader<District>(async (keys) => {
  const districts = await District.findAll({ where: { id: keys } });

  const districtMap = keyBy(districts, (item) => item.id);

  return keys.map((key) => districtMap[key]);
});

const districtsLoader = createNubmerLoader<District[]>(async (keys) => {
  const districts = await District.findAll({ where: { id: keys } });

  const districtMap = groupBy(districts, (item) => item.id);

  return keys.map((key) => districtMap[key]);
});

const districtByProvinceLoader = createNubmerLoader<District>(async (keys) => {
  const districts = await District.findAll({ where: { provinceId: keys } });

  const districtMap = keyBy(districts, (item) => item.provinceId);

  return keys.map((key) => districtMap[key]);
});

const districtsByProvinceLoader = createNubmerLoader<District[]>(
  async (keys) => {
    const districts = await District.findAll({ where: { provinceId: keys } });

    const districtMap = groupBy(districts, (item) => item.provinceId);

    return keys.map((key) => districtMap[key]);
  }
);

const provinceLoader = createNubmerLoader<Province>(async (keys) => {
  const provinces = await Province.findAll({ where: { id: keys } });

  const provinceMap = keyBy(provinces, (item) => item.id);

  return keys.map((key) => provinceMap[key]);
});

const subDistrictsByDistrictLoader = createNubmerLoader<SubDistrict[]>(
  async (keys) => {
    const subDistricts = await SubDistrict.findAll({
      where: { districtId: keys },
    });

    const subDistrictMap = groupBy(subDistricts, (item) => item.districtId);

    return keys.map((key) => subDistrictMap[key]);
  }
);

export const loaders = {
  userLoader,
  usersLoader,
  districtLoader,
  districtsLoader,
  districtByProvinceLoader,
  districtsByProvinceLoader,
  provinceLoader,
  subDistrictsByDistrictLoader,
} as const;
