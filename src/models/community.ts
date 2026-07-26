import { CommunityVisibility } from "../type/domain";

export interface Community {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  visibility: CommunityVisibility;
  createdBy: string;
  memberIds: string[];
  createdAt: Date;
}
