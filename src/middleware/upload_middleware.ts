import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { AppError } from "../errors/app_error";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

const createStorage = (folderName: string, prefix: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const destination = path.join(uploadsRoot, folderName);
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      const ownerId = req.context?.userId || prefix;
      cb(null, `${ownerId}-${Date.now()}-${randomUUID()}${ext.toLowerCase()}`);
    }
  });

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new AppError("Only image files are allowed", 400));
    return;
  }

  cb(null, true);
};

export const userPhotoUpload = multer({
  storage: createStorage("users", "user"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const postImageUpload = multer({
  storage: createStorage("posts", "post"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadsDirectory = uploadsRoot;