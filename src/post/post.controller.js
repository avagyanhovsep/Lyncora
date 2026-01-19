export class PostController {
    constructor(
        service,
        bucketName,
        randomImageName,
        attachImageToBucket,
    ) {
        this.service = service;

        this.createNewPost = this.createNewPost.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.like = this.like.bind(this);
        this.getAllLikes = this.getAllLikes.bind(this);
        this.deletePost = this.deletePost.bind(this);

        this.bucketName = bucketName;
        this.randomImageName = randomImageName;
        this.attachImageToBucket = attachImageToBucket;
    }

    async createNewPost(req, res) {
        const { title, description, location } = req.body;
        const { id } = req.user;
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
        const imageName = this.randomImageName();

        const { url } = await this.attachImageToBucket(
            req.file.buffer,
            this.bucketName,
            req.file.mimetype,
            imageName,
        );

        const newPost = await this.service.createPost(
            title,
            description,
            id,
            imageName,
            url,
            tags,
            location,
        );

        const postInfo = await this.service.findPost(newPost.id);
        return res.status(201).send({ postInfo });
    }

    async getPostInfo(req, res) {
        const { postId } = req.params;
        const postInfo = await this.service.getPostInformation(postId);
        return res.status(200).send({ postInfo });
    }

    async deletePost(req, res) {
        return res.status(200).send({ message: "Post deleted successfully" });
    }

    async like(req, res) {
        const { id } = req.user;
        const { postId } = req.params;
        const reaction = await this.service.createReaction(id, postId);
        return res.status(200).send({ reactionStatus: true, reaction });
    }

    async getAllLikes(req, res) {
        const { postId } = req.params;
        const reactions = await this.service.findAllReactions(postId);
        return res.status(200).send({ reactions });
    }
}
