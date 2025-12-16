export default async function declineRequestValidator(service, req, res, next) {
    const { id: requestId } = req.params;
    const request = await service.followModel.findByPk(requestId);

    if (!request) {
        return res.status(404).send({ message: "Not found" });
    }

    await request.destroy();
    
    return next();
}
