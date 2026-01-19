export class AccountController {
    constructor(
        service,
        sendEmail,
    ) {
        this.service = service;
        this.sendEmail = sendEmail;

        this.getUserInfo = this.getUserInfo.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.setAccountPrivacy = this.setAccountPrivacy.bind(this);
        this.handleAvatarUpload = this.handleAvatarUpload.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.updateTheme = this.updateTheme.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    async getUserInfo(req, res) {
        const { username } = req.params;
        const user = await this.service.findUser({ username });
        return res.status(200).send({ user });
    }

    async searchUsers(req, res) {
        const { text } = req.params;
        const users = await this.service.findAllUsers(text);
        return res.status(200).send({ users });
    }

    async setAccountPrivacy(req, res) {
        const { id } = req.user;
        const user = await this.service.changePrivacy(id);
        return res
            .status(200)
            .send({ isAccountPrivate: user.isAccountPrivate });
    }

    async changeUserEmail(req, res) {
        return res.status(200).send({ message: "Email changed successfully!" });
    }

    async changeUserPassword(req, res) {
        return res
            .status(200)
            .send({ message: "Your password has been changed successfully" });
    }

    async handleAvatarUpload(req, res) {
        const { userId, buffer, mimetype } = req.avatarUpload;
        const { avatarURL } = await this.service.uploadAvatar({
            userId,
            buffer,
            mimetype,
        });

        return res.status(200).json({ picture: avatarURL });
    }

    async updateBio(req, res) {
        const { id } = req.user;
        const { bio } = req.body;

        await this.service.setBio(id, bio);
        return res
            .status(200)
            .send({ bio, message: "Bio updated successfully!" });
    }

    async updateTheme(req, res) {
        const { id } = req.user;
        const { theme } = req.body;

        await this.service.setTheme(id, theme);
        return res.status(200).send({ theme });
    }

    async deleteAccount(req, res) {
        return res.status(200).send({ message: "Account deleted" });
    }
}
