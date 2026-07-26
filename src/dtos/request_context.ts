import { Role } from "../type/domain";

export interface RequestContext {
  userId: string;
  role: Role;
}
