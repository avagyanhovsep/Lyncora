export default function uploadPostImageValidator(
    multer,
    upload,
    req,
    res,
    next,
) {
    upload.single("postImage")(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).send({
                    code: "FILE_TOO_LARGE",
                    message: "File is too large. Max 15MB.",
                });
            }

            return res.status(400).send({
                code: "UPLOAD_ERROR",
                message: "Upload failed.",
            });
        }

        if (err.code === "UNSUPPORTED_FILE_TYPE") {
            return res.status(415).send({
                code: "UNSUPPORTED_FILE_TYPE",
                message: "Only JPG, PNG, and WEBP images are allowed.",
            });
        }

        return res.status(400).send({
            code: "UPLOAD_ERROR",
            message: err.message || "Upload failed.",
        });
    });
}
