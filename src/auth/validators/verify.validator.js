export default async function verifyValidator(service, req, res, next) {
    let { otp, email } = req.body;
    if (!otp) {
        return res.status(400).send({ message: "Unverified..." });
    }

    const user = await service.foundByEmail(email);
    if (!user) {
        return res.status(404).send({ message: "User not found..." });
    }

    let twoMinutes = 120000;
    if (Date.now() - new Date(user.otpCreatedAt).getTime() > twoMinutes) {
        user.isOtpExpired = true;
        await user.save();
    }

    if (user.isOtpExpired) {
        service.generateOTP(user);
        return res.status(401).send({
            message:
                "The code is expired, we sent you the new one, please check your email...",
        });
    }

    if (user.otp !== otp) {
        return res.status(400).send({ message: "Wrong code" });
    }

    user.isSigninAllowed = true;
    await user.save();

    return next();
}
