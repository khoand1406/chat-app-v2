import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
export const upload= multer({ storage: multer.memoryStorage() });

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
    filebuffer: Buffer,
    folder= 'chat-app'
):Promise<string>{
     return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else if (result?.secure_url) resolve(result.secure_url);
        else reject(new Error('Upload failed without result'));
      }
    );
    stream.end(filebuffer);
  });
}
