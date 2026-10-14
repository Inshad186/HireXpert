import multer from "multer";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const allowedDeliveryMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "application/zip",
  "application/x-rar-compressed",
  "text/plain",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const storage = multer.memoryStorage()

export const upload = multer({
    storage,
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter:(req, file, callback) => {
        if(!allowedMimes.includes(file.mimetype)) {
            return callback(generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_FILE_FORMAT))
        }
        callback(null, true)
    }
})

export const uploadDeliveryFiles = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, callback) => {
    if (!allowedDeliveryMimes.includes(file.mimetype)) {
      return callback(
        generateHttpError(
          HttpStatus.BAD_REQUEST,
          "File type not allowed. Supported: Images, PDF, Video, ZIP, Documents"
        )
      );
    }
    callback(null, true);
  },
});
