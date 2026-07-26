import { Role } from "../type/domain";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  photoUrl?: string;
  role: Role;
  communityIds: string[];
  createdAt: Date;
}
