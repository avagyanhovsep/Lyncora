export class AccountService {
    constructor(
        userModel,
        followModel,
        bcryptService,
        chatService,
        sequelize,
        Op,
        SAFE_USER,

        DeleteObjectCommand,
        s3,
        randomImageName,
        attachImageToBucket,
        bucketName,
    ) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.bcryptService = bcryptService;
        this.chatService = chatService;
        this.sequelize = sequelize;
        this.Op = Op;
        this.SAFE_USER = SAFE_USER;

        this.deleteUserAccount = this.deleteUserAccount.bind(this);
        this.DeleteObjectCommand = DeleteObjectCommand;
        this.s3 = s3;
        this.randomImageName = randomImageName;
        this.attachImageToBucket = attachImageToBucket;
        this.bucketName = bucketName;
    }

    async findUser(params) {
        return await this.userModel.findOne({
            where: params,
            attributes: [...this.SAFE_USER, "password"],
            paranoid: false,
            include: [
                {
                    model: this.followModel,
                    as: "followings",
                    include: [
                        {
                            model: this.userModel,
                            as: "receiver",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                {
                    model: this.followModel,
                    as: "followers",
                    include: [
                        {
                            model: this.userModel,
                            as: "sender",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                "posts",
            ],
        });
    }

    async findAllUsers(text) {
        return await this.userModel.findAll({
            where: {
                firstName: {
                    [this.Op.like]: `${text}%`,
                },
            },
            attributes: this.SAFE_USER,
        });
    }

    async changePrivacy(id) {
        const user = await this.findUser({ id });
        user.isAccountPrivate = 1 - user.isAccountPrivate;
        return await user.save();
    }

    async checkPassword(currentPass, pass) {
        return await this.bcryptService.compare(currentPass, pass);
    }

    async hashPassword(password) {
        return await this.bcryptService.hash(password);
    }

    async setBio(id, bio) {
        return await this.userModel.update({ bio }, { where: { id } });
    }

    async setTheme(id, theme) {
        return await this.userModel.update({ theme }, { where: { id } });
    }

    async deleteUserAccount(userId) {
        return await this.sequelize.transaction(async (t) => {
            const user = await this.userModel.findOne({
                where: { id: userId },
                attributes: ["email", "username", "firstName", "lastName"],
                transaction: t,
                paranoid: false,
            });

            if (!user) return null;

            const { email, username, firstName, lastName } = user;

            await this.chatService.cleanupChatsForDeletedUser(userId, t);

            await this.followModel.destroy({
                where: {
                    [this.Op.or]: [{ from: userId }, { to: userId }],
                },
                transaction: t,
            });

            await this.userModel.destroy({
                where: { id: userId },
                transaction: t,
            });

            return { email, username, firstName, lastName };
        });
    }

    async uploadAvatar({ userId, buffer, mimetype }) {
        const user = await this.userModel.findByPk(userId);
        if (user.avatarName?.trim()) {
            await this.deleteOldAvatar(this.bucketName, user.avatarName);
        }

        const imageName = this.randomImageName();

        const { url } = await this.attachImageToBucket(
            buffer,
            this.bucketName,
            mimetype,
            imageName,
        );

        user.avatarName = imageName;
        user.avatarURL = url;
        await user.save();

        return { avatarURL: url, avatarName: imageName };
    }

    async deleteOldAvatar(bucketName, oldAvatar) {
        const params = {
            Bucket: bucketName,
            Key: oldAvatar,
        };

        const command = new this.DeleteObjectCommand(params);
        return await this.s3.send(command);
    }
}
