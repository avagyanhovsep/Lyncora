export default async function createPostValidator(req, res, next) {
    if (!req.file) {
        return res.status(400).send({ message: "Post image is required." });
    }
    return next();
}
