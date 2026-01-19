import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const accessKey = process.env.ACCESS_KEY;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY;
export const bucketRegion = process.env.BUCKET_REGION;
export const bucketName = process.env.BUCKET_NAME;

const storage = multer.memoryStorage();

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);

        const err = new Error("Unsupported file type.");
        err.code = "UNSUPPORTED_FILE_TYPE";
        return cb(err);
    },
});

export const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

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
    let buffer;
    try {
        buffer = await sharp(fileBuffer)
            .resize({
                width: 1080,
                height: 1920,
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();
    } catch {
        const err = new Error("Invalid image file.");
        err.code = "INVALID_IMAGE";
        throw err;
    }

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
