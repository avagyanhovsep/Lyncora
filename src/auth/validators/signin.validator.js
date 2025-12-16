export default async function signinValidator(service, req, res, next) {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials!" });
    }

    const foundByEmail = await service.foundByEmail(email);
    if (!foundByEmail) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    const isPasswordCorrect = await service.checkPassword(
        password,
        foundByEmail.password
    );
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    await service.generateOTP(foundByEmail);

    return next();
}
