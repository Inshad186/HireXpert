import multer from "multer";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

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