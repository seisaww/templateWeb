module.exports = (sequelize, Sequelize) => {
  const Utilisateur = sequelize.define("utilisateur", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    identifiant: {
      type: Sequelize.STRING,
      allowNull: false
    },
    motDePasse: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: "utilisateur", 
    timestamps: false
  });

  return Utilisateur;
};
