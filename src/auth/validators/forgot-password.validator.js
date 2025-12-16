export default async function forgotPasswordValidator(service, req, res, next) {
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

    await service.generateOTP(user);

    return next();
}
