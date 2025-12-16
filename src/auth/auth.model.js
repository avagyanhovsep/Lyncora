export default function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        lastName: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAccountPrivate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isOtpExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otpCreatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isSigninAllowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: "",
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Follow, { foreignKey: "from", as: "followings" });
        User.hasMany(models.Follow, { foreignKey: "to", as: "followers" });
        User.hasMany(models.Post, { foreignKey: "authorId", as: "posts" });
    };
    
    return User;
}
