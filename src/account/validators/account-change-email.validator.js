export default async function accountChangeEmailValidator(
    service,
    sendEmail,
    req,
    res,
    next,
) {
    const { currentPasswordForEmail, newEmail } = req.body;
    const { email } = req.user;

    if (!currentPasswordForEmail?.trim() || !newEmail?.trim()) {
        return res
            .status(400)
            .send({ message: "Missing/Invalid credentials..." });
    }

    const user = await service.findUser({ email });
    if (!user) {
        return res.status(404).send({ message: "User not found..." });
    }

    const passwordMatches = await service.checkPassword(
        currentPasswordForEmail,
        user.password,
    );

    if (!passwordMatches) {
        return res.status(400).send({
            message:
                "Your password is incorrect, please provide correct one or change if you forgot",
        });
    }

    if (user.email == newEmail) {
        return res.status(400).send({
            message: "You already used this email previously, try another...",
        });
    }

    const found = await service.findUser({ email: newEmail });

    if (found) {
        return res.status(400).send({
            message: "This email is already in use, try another...",
        });
    }

    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    void sendEmail(
        oldEmail,
        "Your Lyncora email was changed",
        `Your Lyncora account email was changed from ${oldEmail} to ${newEmail}. \n\nIf you did not make this change, please reset your password immediately and contact support.`,
    );

    void sendEmail(
        newEmail,
        "Your email is now linked to your Lyncora account",
        `This email address (${newEmail}) has been added to your Lyncora account. \n\nIf you did not request this, please contact support.`,
    );

    return next();
}
