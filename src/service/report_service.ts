import { randomUUID } from "crypto";
import { MongoReport, ReportModel } from "../database/mongo_models";
import { Report } from "../models/report";
import { ReportStatus } from "../type/domain";
import { AppError } from "../errors/app_error";

interface CreateReportInput {
  targetType: "POST" | "USER";
  targetId: string;
  reason: string;
}

class ReportService {
  public async create(reporterId: string, payload: CreateReportInput): Promise<Report> {
    const report = await ReportModel.create({
      _id: randomUUID(),
      reporterId,
      targetType: payload.targetType,
      targetId: payload.targetId,
      reason: payload.reason,
      status: ReportStatus.OPEN,
      createdAt: new Date()
    });

    return {
      id: report._id,
      reporterId: report.reporterId,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt
    };
  }

  public async list(): Promise<Report[]> {
    const reports = (await ReportModel.find().lean()) as MongoReport[];
    return reports.map((item) => ({
      id: item._id,
      reporterId: item.reporterId,
      targetType: item.targetType,
      targetId: item.targetId,
      reason: item.reason,
      status: item.status,
      createdAt: item.createdAt
    }));
  }

  public async updateStatus(reportId: string, status: ReportStatus): Promise<Report> {
    const report = (await ReportModel.findByIdAndUpdate(reportId, { status }, { new: true }).lean()) as MongoReport | null;
    if (!report) {
      throw new AppError("Report not found", 404);
    }

    return {
      id: report._id,
      reporterId: report.reporterId,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt
    };
  }
}

export const reportService = new ReportService();
