const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;
const Utilisateur = db.utilisateur;

exports.get = (req, res) => {
  const titre = req.query.titre;
  const condition = titre ? { titre: { [Op.iLike]: `%${titre}%` } } : null;

  Pollution.findAll({
    where: condition,
    include: [{
      model: db.utilisateur,
      as: "utilisateur",
      attributes: ['identifiant', 'nom', 'prenom']
    }],
    order: [['date_observation', 'DESC']]
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Une erreur est survenue."
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Pollution.findByPk(id, {
    include: [{
      model: Utilisateur,
      as: "utilisateur",
      attributes: ['identifiant', 'nom', 'prenom']
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Impossible de trouver la pollution avec id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération id=" + id
      });
    });
};

exports.create = (req, res) => {
  const champsObligatoire = [
    'titre', 'lieu', 'date_observation', 'type_pollution',
    'description', 'latitude', 'longitude'
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

  let userId;
  if (req.token && req.token.payload) {
      userId = req.token.payload.id;
  } else {
      userId = req.token.id;
  }

  if (!userId) {
      return res.status(500).send({ message: "Erreur interne : Impossible de récupérer l'ID utilisateur." });
  }

  const pollution = {
    titre: req.body.titre,
    lieu: req.body.lieu,
    date_observation: req.body.date_observation,
    type_pollution: req.body.type_pollution,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photo_url,
    utilisateurId: userId
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

exports.update = (req, res) => {
  const id = req.params.id;

  let userId;
  if (req.token && req.token.payload) {
      userId = req.token.payload.id;
  } else {
      userId = req.token.id;
  }

  Pollution.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Pollution introuvable.` });
      }

      if (data.utilisateurId != userId) {
        return res.status(403).send({ 
          message: "Accès interdit : Vous ne pouvez modifier que vos propres signalements." 
        });
      }
      
      Pollution.update(req.body, { where: { id: id } })
        .then(num => {
          if (num == 1) {
            res.send({ message: "Succès !" });
          } else {
            res.send({ message: "Rien n'a été modifié." });
          }
        })
        .catch(err => res.status(500).send({ message: "Erreur update." }));
    })
    .catch(err => res.status(500).send({ message: "Erreur serveur." }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  
  let userId;
  if (req.token && req.token.payload) {
      userId = req.token.payload.id;
  } else {
      userId = req.token.id;
  }

  Pollution.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Pollution introuvable.` });
      }

      if (data.utilisateurId != userId) {
        return res.status(403).send({ 
          message: "Accès interdit : Vous ne pouvez supprimer que vos propres signalements." 
        });
      }

      Pollution.destroy({ where: { id: id } })
        .then(num => {
          if (num == 1) {
            res.send({ message: "Suppression réussie !" });
          } else {
            res.send({ message: `Impossible de supprimer.` });
          }
        })
        .catch(err => {
          res.status(500).send({ message: "Erreur suppression." });
        });
    })
    .catch(err => {
      res.status(500).send({ message: "Erreur serveur." });
    });
};
