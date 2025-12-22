const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ACCESS_TOKEN_SECRET } = require('../config.js'); 
const db = require('../models');

const Utilisateur = db.utilisateur; 

function generateAccessToken(user) {
    const payload = { id: user.id, identifiant: user.identifiant };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' }); 
}

function generateRefreshToken(user) {
    const payload = { id: user.id };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '7d' }); 
}

exports.login = (req, res) => {
    const { identifiant, motDePasse } = req.body; 

    if (!identifiant || !motDePasse) {
        return res.status(400).send({ message: "Identifiant et mot de passe sont requis." });
    }

    Utilisateur.findOne({ where: { identifiant: identifiant } })
        .then(async data => {
            if (!data) {
                return res.status(401).send({ message: "Identifiant ou mot de passe incorrect." });
            }

            try {
                const passwordIsValid = await bcrypt.compare(motDePasse, data.motDePasse);
                
                if (!passwordIsValid) {
                    return res.status(401).send({ message: "Identifiant ou mot de passe incorrect." });
                }

                const userForToken = {
                    id: data.id,
                    identifiant: data.identifiant,
                    nom: data.nom,
                    prenom: data.prenom
                };

                const accessToken = generateAccessToken(userForToken);
                const refreshToken = generateRefreshToken(userForToken);

                return res.status(200).send({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: userForToken
                });

            } catch (bcryptError) {
                console.error("Erreur Bcrypt:", bcryptError);
                return res.status(500).send({ message: "Erreur lors de la validation du mot de passe." });
            }
        })
        .catch(err => {
            console.error("Erreur DB:", err);
            res.status(500).send({ message: "Erreur serveur lors de la connexion." });
        });
};