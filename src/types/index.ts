import { User } from "../models/User";

export type ContextType = {
  token: string | undefined;
  user: User | null;
};

export enum ECategory {
  BUG = "BUG",
  FEATURE = "FEATURE",
}
