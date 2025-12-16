export class AuthController {
    constructor(authService) {
        this.authService = authService;

        this.getUser = this.getUser.bind(this);
        this.signup = this.signup.bind(this);
        this.signin = this.signin.bind(this);
        this.verify = this.verify.bind(this);
    }

    async signup(req, res) {
        const { firstName, lastName, username, email, password } = req.body;
        await this.authService.createUser(
            firstName,
            lastName,
            username,
            email,
            password
        );
        return res.status(201).send({ message: `${username} has signed up successfully!` });
    }

    async signin(req, res) {
        const { email } = req.body;
        const user = await this.authService.foundByEmail(email);
        const token = await this.authService.generateToken(user.id);
        const endpoint = user.isSigninAllowed
            ? "/profile"
            : "/signin/confirm-your-account";
        return res.status(200).send({
            message:
                "Code sent, please check your email to confirm the account...",
            token,
            endpoint,
        });
    }

    async getUser(req, res) {
        const user = await this.authService.findUser({ id: req.user.id });
        return res.status(200).send({ user });
    }

    async verify(req, res) {
        return res
            .status(200)
            .send({ message: "Account verified successfully!" });
    }

    async forgotPassword(req, res) {
        return res
            .status(200)
            .send({
                message: "Please check your email to reset your password!",
            });
    }

    async resetPassword(req, res) {
        return res
            .status(200)
            .send({ message: "Your password has been reset successfully!" });
    }
}
