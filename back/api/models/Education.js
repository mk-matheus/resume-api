const getEducationModel = (sequelize, { DataTypes }) => {
  const Education = sequelize.define("Education", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: { isUUID: 4 },
    },
    institutionName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    course: {
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
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Education.associate = (models) => {
    Education.belongsTo(models.Person, {
      foreignKey: "personId",
    });
  };

  return Education;
};

export default getEducationModel;
