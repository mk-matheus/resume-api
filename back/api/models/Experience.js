const getExperienceModel = (sequelize, { DataTypes }) => {
  const Experience = sequelize.define("Experience", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: { isUUID: 4 },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Experience.associate = (models) => {
    Experience.belongsTo(models.Person, {
      foreignKey: "personId",
    });
  };

  return Experience;
};

export default getExperienceModel;
