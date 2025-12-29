export default async function forgotPasswordValidator(
    service,
    sendEmail,
    req,
    res,
    next
) {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials..." });
    }
    const user = await service.foundByEmail(email);
    if (!user) {
        return res.status(404).send({ message: "User not found..." });
    }

    const otp = await service.generateOTP(user);

    void sendEmail(
        user.email,
        "Reset your Lyncora password",
        `You requested a password reset. \n\nYour verification code is ${otp}. It expires in 2 minutes. \n\nIf you did not request this, you can safely ignore this email.`
    );

    return next();
}
