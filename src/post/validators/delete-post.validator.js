export default async function deletePostValidator(
    service,
    DeleteObjectCommand,
    bucketName,
    s3,
    req,
    res,
    next,
) {
    const { postId } = req.params;
    const post = await service.findPost(postId);

    if (!post) {
        return res.status(404).send({ message: "Post not found" });
    }

    if (Number(post.authorId) !== Number(req.user.id)) {
        return res.status(403).send({ message: "Forbidden" });
    }

    const params = {
        Bucket: bucketName,
        Key: post.postImageName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    await service.deletePost(post);

    req.post = post;
    return next();
}
