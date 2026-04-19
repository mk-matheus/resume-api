const getPersonModel = (sequelize, { DataTypes }) => {
  const Person = sequelize.define("Person", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: { isUUID: 4 },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
  });

  Person.associate = (models) => {
    // Vínculo com o dono da conta
    Person.belongsTo(models.User, {
      foreignKey: "userId",
    });

    Person.hasMany(models.ExternalLink, {
      foreignKey: "personId",
      onDelete: "CASCADE",
    });
    Person.hasMany(models.Resume, {
      foreignKey: "personId",
      onDelete: "CASCADE",
    });
    Person.hasMany(models.Education, {
      foreignKey: "personId",
      onDelete: "CASCADE",
    });
    Person.hasMany(models.Experience, {
      foreignKey: "personId",
      onDelete: "CASCADE",
    });
    Person.hasMany(models.Skill, {
      foreignKey: "personId",
      onDelete: "CASCADE",
    });
  };

  return Person;
};

export default getPersonModel;
