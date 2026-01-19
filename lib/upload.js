import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({
    storage,
});
export const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

export const accessKey = process.env.ACCESS_KEY;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY;
export const bucketRegion = process.env.BUCKET_REGION;
export const bucketName = process.env.BUCKET_NAME;

export const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
});

export const attachImageToBucket = async (
    fileBuffer,
    bucketName,
    fileMimetype,
    imageName,
) => {
    const buffer = await sharp(fileBuffer)
        .resize({
            width: 1080,
            height: 1920,
            fit: "inside",
            withoutEnlargement: true,
        })
        .toBuffer();

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: buffer,
        ContentType: fileMimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;

    return { url };
};
