const { Sequelize } = require("sequelize");
const { BDD } = require('../config');

const sequelize = new Sequelize(BDD.bdname, BDD.user, BDD.password, {
    host: BDD.host,
    port: BDD.port,
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, 
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    },
    define: {
        timestamps: false,
        underscored: true
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateur = require("./utilisateur.model.js")(sequelize, Sequelize);

db.utilisateur.hasMany(db.pollution, { 
    as: "pollutions", 
    foreignKey: "utilisateurId" 
});

db.pollution.belongsTo(db.utilisateur, {
    foreignKey: "id_user",
    as: "utilisateurId"
});

module.exports = db;
