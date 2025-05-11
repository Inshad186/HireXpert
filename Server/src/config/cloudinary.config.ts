import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(fileBuffer : Buffer): Promise<string>{
    return new Promise((resolve, reject) => {
        const uploaderStream = cloudinary.uploader.upload_stream(
            {folder : "profile_images", resource_type : "image"},
            (error , result) => {
                if(error) {
                    return reject(error)
                }else if(result?.secure_url){
                    resolve(result.secure_url)
                }else{
                    reject(new Error("upload Failed"))
                }
            }
        )
        uploaderStream.end(fileBuffer)
    })
}

export async function handleProfileImageUpload(fileBuffer: Buffer): Promise<string> {
    return uploadToCloudinary(fileBuffer)
}