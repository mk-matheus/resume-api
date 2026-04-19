const getResumeModel = (sequelize, { DataTypes }) => {
  const Resume = sequelize.define("Resume", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: { isUUID: 4 },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Resume.associate = (models) => {
    Resume.belongsTo(models.Person, {
      foreignKey: "personId",
    });
  };

  return Resume;
};

export default getResumeModel;
