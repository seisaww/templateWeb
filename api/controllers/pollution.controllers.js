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
  .then(data => res.send(data))
  .catch(err => res.status(500).send({ message: err.message || "Erreur." }));
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
      if (data) res.send(data);
      else res.status(404).send({ message: `Introuvable id=${id}.` });
    })
    .catch(err => res.status(500).send({ message: "Erreur id=" + id }));
};

exports.create = (req, res) => {
  const champs = ['titre', 'lieu', 'date_observation', 'type_pollution', 'description', 'latitude', 'longitude'];
  const manquant = champs.filter(c => !req.body[c]);
  
  if (manquant.length > 0) {
    return res.status(400).send({ message: `Champs obligatoires : ${manquant.join(', ')}` });
  }

  // Simplification : l'ID est directement dans req.token.id
  const userId = req.token ? req.token.id : null;

  if (!userId) {
      return res.status(500).send({ message: "Erreur : ID utilisateur introuvable." });
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
  .then(data => res.status(201).send({ message: "Succès !", pollution: data }))
  .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  
  // Simplification : l'ID est directement dans req.token.id
  const userId = req.token ? req.token.id : null;

  console.log("DEBUG UPDATE - ID Token:", userId);

  Pollution.findByPk(id)
    .then(data => {
      if (!data) return res.status(404).send({ message: `Introuvable.` });

      console.log("DEBUG UPDATE - ID DB:", data.utilisateurId);

      if (data.utilisateurId != userId) {
        return res.status(403).send({ message: "Interdit : Ce n'est pas votre signalement." });
      }
      
      Pollution.update(req.body, { where: { id: id } })
        .then(num => {
          if (num == 1) res.send({ message: "Succès !" });
          else res.send({ message: "Rien n'a été modifié." });
        })
        .catch(err => res.status(500).send({ message: "Erreur update." }));
    })
    .catch(err => res.status(500).send({ message: "Erreur serveur." }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  
  // Simplification : l'ID est directement dans req.token.id
  const userId = req.token ? req.token.id : null;

  console.log("DEBUG DELETE - ID Token:", userId);

  Pollution.findByPk(id)
    .then(data => {
      if (!data) return res.status(404).send({ message: `Introuvable.` });

      console.log("DEBUG DELETE - ID DB:", data.utilisateurId);

      if (data.utilisateurId != userId) {
        return res.status(403).send({ message: "Interdit : Ce n'est pas votre signalement." });
      }

      Pollution.destroy({ where: { id: id } })
        .then(num => {
          if (num == 1) res.send({ message: "Suppression réussie !" });
          else res.send({ message: `Impossible de supprimer.` });
        })
        .catch(err => res.status(500).send({ message: "Erreur suppression." }));
    })
    .catch(err => res.status(500).send({ message: "Erreur serveur." }));
};
