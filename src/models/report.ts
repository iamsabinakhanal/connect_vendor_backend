import { ReportStatus } from "../type/domain";

export interface Report {
  id: string;
  reporterId: string;
  targetType: "POST" | "USER";
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
}
