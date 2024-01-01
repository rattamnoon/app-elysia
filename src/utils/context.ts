import { Loader, loaders } from "./loader";

export type GraphQLContext = {
  loaders: Loader;
};

export function createContext(): GraphQLContext {
  return { loaders };
}
