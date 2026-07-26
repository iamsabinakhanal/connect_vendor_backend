import { Router } from "express";
import { authRouter } from "./auth_routes";
import { communityRouter } from "./community_routes";
import { messageRouter } from "./message_routes";
import { notificationRouter } from "./notification_routes";
import { postRouter } from "./post_routes";
import { reportRouter } from "./report_routes";
import { userRouter } from "./user_routes";
import { adminCategoryRouter } from "./admin/category_routes";
import { adminCommunityRouter } from "./admin/community_routes";
import { adminNotificationRouter } from "./admin/notification_routes";
import { adminPostRouter } from "./admin/post_routes";
import { adminReportRouter } from "./admin/report_routes";
import { adminUserRouter } from "./admin/user_routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/communities", communityRouter);
router.use("/posts", postRouter);
router.use("/messages", messageRouter);
router.use("/reports", reportRouter);
router.use("/notifications", notificationRouter);

router.use("/admin/users", adminUserRouter);
router.use("/admin/categories", adminCategoryRouter);
router.use("/admin/communities", adminCommunityRouter);
router.use("/admin/posts", adminPostRouter);
router.use("/admin/reports", adminReportRouter);
router.use("/admin/notifications", adminNotificationRouter);

export { router };
