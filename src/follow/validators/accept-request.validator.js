export default async function acceptRequestValidator(service, req, res, next) {
    const { id } = req.params;
    const found = await service.userModel.findByPk(id);

    if (!found) {
        return res.status(404).send({ message: "Not found" });
    }

    found.approved = true;
    await found.save();

    return next();
}
