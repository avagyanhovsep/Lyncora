export class AccountService {
    constructor(userModel, bcryptService, Op, SAFE_USER) {
        this.userModel = userModel;

        this.bcryptService = bcryptService;
        this.Op = Op;
        this.SAFE_USER = SAFE_USER;
    }

    async findUser(params) {
        return await this.userModel.findOne({
            where: params,
            include: ["followers", "followings", "posts"],
            attributes: [...this.SAFE_USER, 'password'],
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
        const user = await this.findUser({id});
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
