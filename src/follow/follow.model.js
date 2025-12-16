export default function (sequelize, DataTypes) {
    const Follow = sequelize.define("Follow", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        from: {
            type: DataTypes.INTEGER,
        },
        to: {
            type: DataTypes.INTEGER,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, { foreignKey: "from", as: "sender" });
        Follow.belongsTo(models.User, { foreignKey: "to", as: "receiver" });
    };

    return Follow;
}
