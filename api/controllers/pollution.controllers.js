const { v4: uuidv4 } = require ("uuid");

const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {

     Pollution.findAll()
    .then(data => {res.send(data);})
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });

}; 
