import { PassThrough } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

export const uploadImageToCloudinary = async (file) => {
    try {
        const bufferStream = new PassThrough();
        bufferStream.end(file.buffer);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            bufferStream.pipe(uploadStream);
        });

        return result.secure_url;
    } catch (error) {
        console.error(error);
    }
}
