export class CommentController {
    constructor(service, userModel, SAFE_USER) {
        this.service = service;
        this.userModel = userModel;
        this.SAFE_USER = SAFE_USER;

        this.getAllComments = this.getAllComments.bind(this);
        this.addComment = this.addComment.bind(this);
        this.react = this.react.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    async getAllComments(req, res) {
        const { postId } = req.params;
        const comments = await this.service.findAllComments(postId);
        return res.status(200).send({ comments });
    }

    async addComment(req, res) {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;
        const comment = await this.service.createComment(postId, userId, text);
        return res.status(201).send({ comment });
    }

    async deleteComment(req, res) {
        await this.service.deleteUserComment(req.comment);
        return res
            .status(200)
            .send({ message: "Comment deleted successfully!" });
    }

    async react(req, res) {
        const { commentId } = req.params;
        const userId = req.user.id;

        const commentReaction = await this.service.createCommentReaction(
            commentId,
            userId
        );

        await commentReaction.reload({
            include: {
                model: this.userModel,
                as: "user",
                attributes: this.SAFE_USER,
            },
        });

        return res.status(201).send({ commentReactionStatus: true, commentReaction });
    }

    async getAllReactions(req, res) {}
}
