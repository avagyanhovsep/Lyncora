export default function uploadAvatarValidator(req, res, next) {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
        return res
            .status(400)
            .json({ message: "Profile picture is required." });
    }

    req.avatarUpload = {
        userId: req.user.id,
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
    };

    return next();
}
