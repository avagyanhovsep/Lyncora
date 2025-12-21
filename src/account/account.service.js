export class AccountService {
    constructor(userModel, followModel, bcryptService, Op, SAFE_USER) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.bcryptService = bcryptService;
        this.Op = Op;
        this.SAFE_USER = SAFE_USER;
    }

    async findUser(params) {
        return await this.userModel.findOne({
            where: params,
            attributes: this.SAFE_USER,
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
}
