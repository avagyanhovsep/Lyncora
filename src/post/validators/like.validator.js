export default async function likeValidator(service, req, res, next) {
    const userId = req.user.id;
    const { postId } = req.params;

    const found = await service.findReaction(userId, postId);

    if (found) {
        await found.destroy();
        return res.send({ reactionStatus: false });
    }

    return next();
}
