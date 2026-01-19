import { Op } from "sequelize";

export class ChatService {
    constructor(
        chatModel,
        memberModel,
        userModel,
        messageModel,
        followModel,
        SAFE_USER,
        sequelize,
    ) {
        this.chatModel = chatModel;
        this.memberModel = memberModel;
        this.userModel = userModel;
        this.messageModel = messageModel;
        this.followModel = followModel;
        this.SAFE_USER = SAFE_USER;
        this.sequelize = sequelize;
    }

    async getAllChats(userId) {
        const members = await this.memberModel.findAll({
            where: { userId, deletedAt: null },
            attributes: ["chatId", "lastReadAt", "clearedAt"],
            include: [
                {
                    model: this.chatModel,
                    as: "chat",
                    include: [
                        {
                            model: this.memberModel,
                            as: "members",
                            required: true,
                            attributes: ["userId", "lastReadAt"],
                            include: [
                                {
                                    model: this.userModel,
                                    as: "user",
                                    attributes: [
                                        ...this.SAFE_USER,
                                        "deletedAt",
                                    ],
                                    paranoid: false,
                                },
                            ],
                        },
                        {
                            model: this.messageModel,
                            as: "messages",
                            separate: true,
                            limit: 1,
                            order: [["createdAt", "DESC"]],
                            attributes: ["id", "text", "userId", "createdAt"],
                            include: [
                                {
                                    model: this.userModel,
                                    as: "sender",
                                    attributes: [
                                        ...this.SAFE_USER,
                                        "deletedAt",
                                    ],
                                    paranoid: false,
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["updatedAt", "DESC"]],
        });

        return members.map((member) => member.chat);
    }

    async isMember(chatId, userId) {
        const member = await this.memberModel.findOne({
            where: { chatId, userId },
        });

        return !!member;
    }

    async getUserMessages(chatId, userId) {
        const cid = Number(chatId);

        const member = await this.memberModel.findOne({
            where: { chatId: cid, userId },
            attributes: ["clearedAt"],
        });

        if (!member) return [];

        const where = { chatId: cid };

        if (member.clearedAt) {
            where.createdAt = { [Op.gt]: member.clearedAt };
        }

        return this.messageModel.findAll({
            where,
            order: [["createdAt", "ASC"]],
            include: [
                {
                    model: this.userModel,
                    as: "sender",
                    attributes: [...this.SAFE_USER, "deletedAt"],
                    paranoid: false,
                },
            ],
        });
    }

    async createMessage(chatId, senderId, text) {
        if (!text?.trim()) return null;

        const cid = Number(chatId);

        return this.sequelize.transaction(async (t) => {
            const sender = await this.userModel.findByPk(senderId, {
                attributes: ["id", "deletedAt"],
                paranoid: false,
                transaction: t,
            });

            if (!sender || sender.deletedAt) return null;

            const members = await this.memberModel.findAll({
                where: { chatId: cid },
                attributes: ["userId"],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            const receiverId = members.find(
                (member) => member.userId !== senderId,
            )?.userId;
            if (!receiverId) return null;

            const message = await this.messageModel.create(
                { chatId: cid, userId: senderId, text },
                { transaction: t },
            );

            await this.memberModel.update(
                { deletedAt: null },
                { where: { chatId: cid, userId: receiverId }, transaction: t },
            );

            return message;
        });
    }

    async getChat(userId, partnerId) {
        const partner = await this.userModel.findByPk(partnerId, {
            attributes: ["id", "deletedAt", "isAccountPrivate"],
            paranoid: false,
        });

        if (!partner || partner.deletedAt) return null;

        const rows = await this.memberModel.findAll({
            where: { userId: [userId, partnerId] },
            attributes: [
                "chatId",
                [
                    this.sequelize.fn("COUNT", this.sequelize.col("userId")),
                    "cnt",
                ],
            ],
            group: ["chatId"],
            having: this.sequelize.literal("COUNT(userId) = 2"),
        });

        const existingChatId = rows?.[0]?.chatId;

        if (existingChatId) {
            return this.chatModel.findByPk(existingChatId, {
                include: [
                    {
                        model: this.memberModel,
                        as: "members",
                        attributes: ["userId", "lastReadAt"],
                        include: [
                            {
                                model: this.userModel,
                                as: "user",
                                attributes: [...this.SAFE_USER, "deletedAt"],
                                paranoid: false,
                            },
                        ],
                    },
                    {
                        model: this.messageModel,
                        as: "messages",
                        separate: true,
                        limit: 1,
                        order: [["createdAt", "DESC"]],
                        attributes: ["id", "text", "userId", "createdAt"],
                        include: [
                            {
                                model: this.userModel,
                                as: "sender",
                                attributes: [...this.SAFE_USER, "deletedAt"],
                                paranoid: false,
                            },
                        ],
                    },
                ],
            });
        }

        return this.sequelize.transaction(async (t) => {
            const chat = await this.chatModel.create({}, { transaction: t });

            await this.memberModel.bulkCreate(
                [
                    { chatId: chat.id, userId },
                    { chatId: chat.id, userId: partnerId },
                ],
                { transaction: t },
            );

            return this.chatModel.findByPk(chat.id, {
                transaction: t,
                include: [
                    {
                        model: this.memberModel,
                        as: "members",
                        attributes: ["userId", "lastReadAt"],
                        include: [
                            {
                                model: this.userModel,
                                as: "user",
                                attributes: [...this.SAFE_USER, "deletedAt"],
                                paranoid: false,
                            },
                        ],
                    },
                    {
                        model: this.messageModel,
                        as: "messages",
                        separate: true,
                        limit: 1,
                        order: [["createdAt", "DESC"]],
                        attributes: ["id", "text", "userId", "createdAt"],
                        include: [
                            {
                                model: this.userModel,
                                as: "sender",
                                attributes: [...this.SAFE_USER, "deletedAt"],
                                paranoid: false,
                            },
                        ],
                    },
                ],
            });
        });
    }

    async canMessageUser(from, to) {
        const partner = await this.userModel.findByPk(to, {
            attributes: ["id", "isAccountPrivate", "deletedAt"],
            paranoid: false,
        });

        if (!partner || partner.deletedAt) return false;

        const isPrivate =
            partner.isAccountPrivate == true ||
            partner.isAccountPrivate == 1 ||
            partner.isAccountPrivate == "1";

        if (!isPrivate) return true;

        const follow = await this.followModel.findOne({
            where: { from, to, approved: 1 },
        });

        return !!follow;
    }

    async findMembers(chatId) {
        return this.memberModel.findAll({ where: { chatId } });
    }

    async markChatRead(chatId, userId) {
        await this.memberModel.update(
            { lastReadAt: new Date() },
            { where: { chatId, userId } },
        );
    }

    async cleanupChatsForDeletedUser(userId, transaction) {
        const rows = await this.memberModel.findAll({
            where: { userId },
            attributes: ["chatId"],
            group: ["chatId"],
            transaction,
        });

        const chatIds = rows.map((row) => row.chatId);
        if (!chatIds.length) return;

        for (const chatId of chatIds) {
            const members = await this.memberModel.findAll({
                where: { chatId },
                attributes: ["userId"],
                include: [
                    {
                        model: this.userModel,
                        as: "user",
                        attributes: ["id", "deletedAt"],
                        paranoid: false,
                        required: true,
                    },
                ],
                transaction,
            });

            if (members.length !== 2) continue;

            const bothDeleted = members.every((m) => !!m.user?.deletedAt);

            if (bothDeleted) {
                await this.chatModel.destroy({
                    where: { id: chatId },
                    transaction,
                    individualHooks: true,
                });
            }
        }
    }

    async findUserByIdIncludingDeleted(userId) {
        return this.userModel.findByPk(userId, {
            attributes: ["id", "deletedAt", "isAccountPrivate"],
            paranoid: false,
        });
    }

    async deleteChatForUser(chatId, userId) {
        const cid = Number(chatId);

        return this.sequelize.transaction(async (t) => {
            const member = await this.memberModel.findOne({
                where: { chatId: cid, userId },
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            if (!member) return;

            const now = new Date();
            await member.update(
                { deletedAt: now, clearedAt: now, lastReadAt: now },
                { transaction: t },
            );
        });
    }

    async findMessageInChat(chatId, messageId) {
        return this.messageModel.findOne({
            where: { id: messageId, chatId },
            paranoid: false,
        });
    }

    async unsendMessage(chatId, messageId) {
        const msg = await this.findMessageInChat(chatId, messageId);
        if (!msg) return false;

        if (msg.deletedAt) return true;
        await msg.destroy();
        return true;
    }
}
