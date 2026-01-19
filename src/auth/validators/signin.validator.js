export default async function signinValidator(
    service,
    sendEmail,
    req,
    res,
    next,
) {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials!" });
    }

    const user = await service.foundByEmail(email);
    if (!user) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    const isPasswordCorrect = await service.checkPassword(
        password,
        user.password,
    );

    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    if (!user.isSigninAllowed) {
        const { otp } = await service.resendOTP(user, 30000);

        void sendEmail(
            user.email,
            "Your Lyncora verification code",
            `Your verification code is ${otp}. \n\nIt expires in 2 minutes. If you did not request this, you can ignore this email.`,
        );
    }

    req.user = user;
    return next();
}
