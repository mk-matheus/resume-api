const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("User", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: { isUUID: 4 },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        // Apenas letras, números e hífen — vira a URL pública /u/:username
        is: /^[a-z0-9-]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    // Cada usuário tem exatamente um currículo (Person)
    User.hasOne(models.Person, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return User;
};

export default getUserModel;
