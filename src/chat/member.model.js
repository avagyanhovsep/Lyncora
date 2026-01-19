export default function (sequelize, DataTypes) {
    const Member = sequelize.define("Member", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        chatId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        lastReadAt: { type: DataTypes.DATE, allowNull: true },
        deletedAt: { type: DataTypes.DATE, allowNull: true },
        clearedAt: { type: DataTypes.DATE, allowNull: true },
    });

    Member.associate = (models) => {
        Member.belongsTo(models.Chat, { foreignKey: "chatId", as: "chat" });
        Member.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    };

    return Member;
}
