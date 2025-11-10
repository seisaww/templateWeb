const { v4: uuidv4 } = require ("uuid");
const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

// récuperer toutes les pollutions 
exports.get = (req, res) => {

     Pollution.findAll()
    .then(data => {res.send(data);})
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });

}; 

// recupérer une seule pollutions 
exports.findOne = (req, res) => {
    const id = req.params.id;
     Pollution.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ // 404 pour Not Found
          message: `Pollution non trouvée avec l'id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de la pollution id=" + id
      });
    });

}; 

// pour créer une pollution 
exports.create = (req, res) => {

  const champsObligatoire = [
    'titre',
    'lieu',
    'date_observation',
    'type_pollution',
    'description',
    'latitude',
    'longitude' // photo non présente car non obligatoire
  ];

  const champsManquant = [];

  for (const champs of champsObligatoire){
      if (!req.body[champs]) {
        champsManquant.push(champs);
      };
    }
  

  if (champsManquant.length > 0) {
    res.status(400).send({
      message: `Les champs suivants sont obligatoires : ${champsManquant.join(', ')}`
    });
    return; 
  }

  const pollution = {
    titre: req.body.titre,
    lieu: req.body.lieu,
    date_observation: req.body.date_observation,
    type_pollution: req.body.type_pollution,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photo_url
  };

  Pollution.create(pollution)
  .then(data => {
    res.status(201).send({
      message: "Pollution créée avec succès !",
      pollution: data
    });
  })
  .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la création de la pollution."
      });
    });
};


// mettre à jour une pollution 
exports.update = (req, res) => {
  const id = req.params.id;

  Pollution.update(req.body, {
    where: { id: id}
  })
    .then(num => {
      if ( num == 1){
        res.send ({
          message : "Pollution mise à jour avec succès."
        });
      } else {
        res.status(404).send ({
          message : "Mise à jour impossible, pollution non trouvée."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de la pollution id=" + id
      });
    });
}

// supprimer une pollution 
exports.delete = (req, res) => {
  const id = req.params.id;

  Pollution.destroy( {
    where: { id: id}
  })
    .then(num => {
      if ( num == 1){
        res.send ({
          message : "Pollution supprimée avec succès."
        });
      } else {
        res.status(404).send ({
          message : "Suppression impossible, pollution non trouvée."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppresion de la pollution id=" + id
      });
    });
}
