const getSkillModel = (sequelize, { DataTypes }) => {
  const Skill = sequelize.define("Skill", {
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
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Skill.associate = (models) => {
    Skill.belongsTo(models.Person, {
      foreignKey: "personId",
    });
  };

  return Skill;
};

export default getSkillModel;
