const getExternalLinkModel = (sequelize, { DataTypes }) => {
  const ExternalLink = sequelize.define("ExternalLink", {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true,
      },
    },
  });
  ExternalLink.associate = (models) => {
    ExternalLink.belongsTo(models.Person, {
      foreignKey: "personId",
    });
  };
  return ExternalLink;
};

export default getExternalLinkModel;
