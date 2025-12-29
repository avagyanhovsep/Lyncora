export default async function deleteAccountValidator(
    service,
    sendEmail,
    req,
    res,
    next
) {
    const { id } = req.user;

    const deleted = await service.deleteUserAccount(id);

    if (!deleted) {
        return res.status(404).send({ message: "User not found" });
    }

    if (deleted.email) {
        const display =
            `${deleted.firstName || ""} ${deleted.lastName || ""}`.trim() ||
            deleted.username ||
            "there";

        await sendEmail(
            deleted.email,
            "Your Lyncora account was deleted",
            `Hi ${display},\n\nYour Lyncora account has been deleted successfully.\n\nIf you did not request this, please contact support.\n\n— Lyncora`
        );
    }

    return next();
}
