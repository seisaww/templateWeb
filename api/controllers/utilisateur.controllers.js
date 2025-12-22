const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require ("uuid");
const db = require("../models");
const Utilisateurs = db.utilisateur;
const Op = db.Sequelize.Op;

// recupérer tous les users  
exports.get = (req, res) => {
     Utilisateurs.findAll()
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
     Utilisateurs.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ // 404 pour Not Found
          message: `Utilisateur non trouvée avec l'id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur id=" + id
      });
    });

}; 


// pour créer une pollution 
exports.create = async (req, res) => {

  const champsObligatoire = [
    'nom',
    'prenom',
    'identifiant',
    'motDePasse'
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

  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt);

    const user = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      identifiant: req.body.identifiant,
      motDePasse: hashedPassword
    };

    const data = await Utilisateurs.create(user); 

    res.status(201).send({
      message: "Utilisateur créé avec succès !",
      user: {
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          identifiant: data.identifiant
      }
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la création de l'utilisateur."
    });
  }
};

// // Find a single Utilisateur with an login   
// exports.login = (req, res) => {
//   const utilisateur = {
//     login: req.body.login,
//     password: req.body.password
//   };

//   // Test
//   let pattern = /^[A-Za-z0-9]{1,20}$/;
//   if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
//      Utilisateurs.findOne({ where: { login: utilisateur.login } })
//     .then(data => {
//       if (data) {
//         const user = {
//           id: data.id,
//           name: data.nom,
//           email: data.email
//         };
      
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: `Cannot find Utilisateur with login=${utilisateur.login}.`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(400).send({
//         message: "Error retrieving Utilisateur with login=" + utilisateur.login
//       });
//     });
//   } else {
//     res.status(400).send({
//       message: "Login ou password incorrect" 
//     });
//   }
// };


