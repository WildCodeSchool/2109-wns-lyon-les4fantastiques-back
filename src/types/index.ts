import { User } from "../models/User";

export type ContextType = {
  token: string | undefined;
  user: User | null;
};

export enum ERole {
  ADMIN = "ADMIN",
  PO = "PO",
  DEV = "DEV",
}
